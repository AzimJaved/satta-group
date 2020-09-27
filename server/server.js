
require('dotenv').config()
const express = require('express')
const scraper = require('./libs/scraper')
const bodyParser = require('body-parser')
const crypto = require('crypto-js')
const cors = require('cors')

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

const userSchema = new mongoose.Schema({
    username: String,
    players: [],
    currScore: Number,
    cumScore: Number
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
                .then(savedToken => {
                    console.log("New login detected")
                    Auth.find({}, (err, result) => {
                        if (err) {
                            console.log(err)
                            res.json({ authenticated: false, token: null })
                            return
                        }
                    })
                    res.json({ authenticated: true, token: token })
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
    res.send(JSON.stringify(u));
});



async function calculatePoints() {
    let url = "https://www.espncricinfo.com/series/8048/scorecard/1216539/chennai-super-kings-vs-delhi-capitals-7th-match-indian-premier-league-2020-21";
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

    // console.log(userTeams);

    let pointsTable = await points.calculate(userTeams, scoring);
    console.log(pointsTable)

    // console.log (Object.keys(pointsTable));

    Object.keys(pointsTable).forEach( async(satteri)=>{
        let res = await User.updateOne({username : satteri}, {currScore: pointsTable[satteri].currentScore});
        console.log(res.n);
    });
}

calculatePoints();


scraper.cricbuzzWorker('22663')
app.listen(PORT, () => {
    console.log(`app league server listening on PORT: ${PORT}`)
})

setInterval(calculatePoints, 30000);