
require('dotenv').config()
const express = require('express')
const scraper = require('./libs/scraper')
const bodyParser = require('body-parser')
const crypto = require('crypto-js')
const cors = require('cors')

const dotenv = require('dotenv')
const result = dotenv.config()
if (result.error) {
    console.log(result.error)
    throw result.error
}

const points = require('./libs/points')

const connection = require('./libs/mongo')
const { Auth } = require('./libs/auth')


const PORT = process.env.port || 8000

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors())
app.options('*', cors())

const { firebaseAuth } = require('./libs/firebase')
const mongoose = require('mongoose');

const Player = mongoose.model('Player', mongoose.Schema({ name: String, type: String }));
const SattaStatus = mongoose.model("SattaStatus", mongoose.Schema({ status: Boolean, url : String}));

const userSchema = new mongoose.Schema({
    username: String,
    players: [],
    currScore: Number,
    cumScore: Number, 
    sattaLagaDiya: Boolean
});
const User = mongoose.model('User', userSchema);

app.post('/login', (req, res) => {
    let time = Date()
    console.log(req.body.email + " " + req.body.password)
    firebaseAuth.signInWithEmailAndPassword(req.body.email, req.body.password)
        .then(() => {
            let token = crypto.MD5('/AzIm/' + req.body.email + '*' + req.body.password + '*' + time.toString() + '/AyEsha/').toString()
            let authToken = new Auth({ token: token, date: time, valid: true })
            authToken.save()
                .then( async savedToken => {
                    console.log("New login detected")
                    Auth.find({}, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.json({ authenticated: false, token: null })
                            return
                        }
                    })
                    let ss = await SattaStatus.find({});
                    // console.log(ss);
                    ss = ss[0];
                    let sattaOn  = false;
                    if(ss.status){
                        sattaOn = ss.status;
                    }
                    let sattaLagaDiya = false;
                    let user = await User.findOne({username: req.body.username});
                    if(user){
                        sattaLagaDiya = user.sattaLagaDiya;
                    }
                    res.json({ authenticated: true, token: token, sattaOn: sattaOn, sattaLagaDiya: sattaLagaDiya });
                    return
                })
                .catch((err) => {
                    console.log(err)
                    console.log("Database save failed")
                    res.json({ authenticated: false, token: null })
                    return
                })
        })
        .catch(() => {
            console.log("Sign in failed")
            res.json({ authenticated: false, token: null })
            return
        })
})

app.post('/createUser', async (req, res) => {
    if (req.body.key == process.env.ADMIN_KEY) {
        const newUser = new User({
            username: req.body.username,
            players: [],
            currScore: 0,
            cumScore: 0, 
            sattaLagaDiya: false
        });
        newUser.save((err, resu) => {
            if (err) return res.sendStatus(500);
            return res.sendStatus(201);
        });
    }
    else
        res.sendStatus(401);
});

app.post('/submitSatta', async (req, res) => {
    let token = req.body.token;
    let isValid = await Auth.findOne({ token: token }).exec();
    if (isValid) {
        console.log("User is authed");
        let selectedPlayers = req.body.players;
        console.log(selectedPlayers);
        let username = req.body.username;
        let q = await User.updateOne({ username: username }, { players: selectedPlayers });
        if (q.n) {
            return res.sendStatus(201);
        }
        return res.sendStatus(500);
    }
    else {
        console.log("User is not authenticated");
        console.log(401);
        return res.sendStatus(401);
    }
});

app.get('/scores', async (req, res) => {
    console.log("Scores");
    let u = await User.find({}, ['username', 'currScore', 'cumScore']);
    res.json(u);
});

app.get('/players', async (req, res) => {
    let players = await Player.find({}, ['name', 'type']);
    res.json(players);
});

app.post('/players', async (req, res) => {
    if (req.body.key == process.env.ADMIN_KEY) {
        let ress = await Player.deleteMany({});
        let players = req.body.players;
        players.forEach((player) => {
            let p = new Player({ name: player.name, type: player.type });
            p.save();
        });
        res.sendStatus(201);
    }
    else
        res.sendStatus(401);
});

app.post('/satta', async (req, res) => {
    if (req.body.key == process.env.ADMIN_KEY) {
        let status = req.body.status;
        if (status == 'ON' || status == 1 || status == 'on') {
            // Reset sattaLagaDiya for all users, set satta as on
            let ress = await User.updateMany({}, {sattaLagaDiya: false});
            console.log(ress.n);
            ress = await SattaStatus.deleteMany({});
            let sstatus = 1;
            let matchUrl = req.body.matchUrl;
            let newStatus = new SattaStatus({status: sstatus, url: matchUrl});
            newStatus.save();
            return res.sendStatus(201);
        }
        else if(status == "OFF" || status == 'off' || status == 0){
            let ress = await SattaStatus.updateMany({}, {status: false});
            return res.sendStatus(201);
        }
    }
    else
        res.sendStatus(401);
});

app.get('/satta', async(req, res)=>{
    let ss = await SattaStatus.find({});
    // console.log(ss);
    ss = ss[0];
    if(ss.status){
        return res.send(ss.status);
    }
    res.send("OFF");
});

async function calculatePoints() {
    // let url = "https://www.espncricinfo.com/series/8048/scorecard/1216539/chennai-super-kings-vs-delhi-capitals-7th-match-indian-premier-league-2020-21";
    let url = await SattaStatus.find({});
    url = url[0];
    url = url.url;
    if(!url) return;
    // console.log(url);
    var scoring = {
        "wicket": 20,
        "run": 1,
        "catch": 10,
        "stump": 10,
        "captainMultiplier": 1.5
    };
    let userTeams = {};
    userTeams.matchUrl = url;
    userTeams.users = [];
    let users = await User.find({});
    users.forEach((satteri) => {
        var obj = {};
        obj.username = satteri.username;
        var team = [];
        for (let r = 0; r < satteri.players.length; r++) {
            team.push({ "name": satteri.players[r], "captain": false });
        }
        obj.totalScore = satteri.currScore;
        obj.team = team;
        userTeams.users.push(obj);
    });
    let pointsTable = await points.calculate(userTeams, scoring);
    Object.keys(pointsTable).forEach(async (satteri) => {
        // if (users[satteri].currScore != pointsTable[satteri].currentScore)
        let res = await User.updateOne({ username: satteri }, { currScore: pointsTable[satteri].currentScore });
    });
}
calculatePoints();

app.listen(PORT, () => {
    console.log(`app league server listening on PORT: ${PORT}`)
})

setInterval(calculatePoints, 30000);