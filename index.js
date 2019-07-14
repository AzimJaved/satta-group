const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path')
const PORT = process.env.PORT || 3000;
const calc = require('./util/calculate')
const db = require('./util/Database').database

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'pages')));

app.set('views', path.join(__dirname, 'pages'))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/pages/layouts',
    partialsDir: [
        __dirname + '/pages/partials'
    ]
}))

app.get('/', (req,res) => {
    res.render('index',{
        title : 'Satta Group'
    })  
})

app.post('/sattaSubmit', (req,res) =>{
    let data = req.body
    db.ref('/currentMatch').once("value",function(snapshot){
        let dbData = snapshot.val()
        let matchId = dbData.matchId
        if(dbData.sattaOn){
            db.ref(matchId +'/'+ data.name).set(data, function(error){
                if(!error){
                    res.render('success', {
                        title : 'Success - Satta Group'
                    }
                )}
                else{ 
                    res.send("An error occured")
                    console.log(error)        
                }
            })
        }
    })    
})

app.get('/points', (req, res) => {
    res.render("points",{
        title: "Points Table - Satta Group"
    })
})

app.get('/pointsTable', (req, res) => {
    db.ref('/').once("value", function(snapshot){ 
        let data = snapshot.val();
        if( ((Date.now() - data.currentMatch.matchPoints.time) >= 300000 && (data.currentMatch.liveScoreboard) || data.currentMatch.completion)){
                calc.calculate().then((livePoints) => {
                    res.json( {
                        "todaysPoints" : livePoints,
                        "totalPoints": currentPoints(livePoints, data.points)
                    })
                })  
        }
        else {
                res.json( {
                "todaysPoints" : data.currentMatch.matchPoints,
                "totalPoints": currentPoints(data.currentMatch.matchPoints, data.points)
            })
        }
    })
})

app.get('/matchTeams', (req,res)=> {
    db.ref('/currentMatch').once("value", function(snapshot){
        let data = snapshot.val();
        res.json(data)  
    })
})

app.get('/teams', (req, res) =>{
    res.render("teams", {
        title : "Teams - Satta Group"
    })
})

app.get('/fetchTeams', (req, res) => {
    db.ref('/').once("value", function(snapshot){
        let data = snapshot.val()
        res.json(data[data.currentMatch.matchId])
    })
})

app.get('/playerWisePoints', (req,res) => {
    res.render("playerPoints", {
        title : "Player Wise Points - Satta Group"
    })
})

app.get('/playerPoints', (req,res) =>{
    db.ref('/currentMatch/playerPoints').once("value", function(snapshot) {
        let data = snapshot.val()
        res.json(data)
    })
})

app.listen(PORT, () => {
    console.log("Booted")
})

function currentPoints(livePoints, pointsTable){
    var points = {
        "players" : {}
    }
    for(player in livePoints.players){
        points.players[player] = pointsTable.players[player] + livePoints.players[player]
    }
    return points;
}