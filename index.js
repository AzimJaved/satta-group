const express = require('express');
const app = express();
const fs = require('fs');
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
        let matchId = snapshot.val().matchId 
        db.ref(matchId +' /'+ data.name).set(data, function(error){
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
        if( (((Date.now() - data.currentMatch.matchPoints.time) >= 300000) && data.currentMatch.liveScoreboard) || data.currentMatch.completion){
            calc.calculate();
        }
        res.json(currentPoints(data.currentMatch.matchPoints, data.points)) 
    })
})

app.get('/teams', (req,res)=> {
    db.ref('/currentMatch').once("value", function(snapshot){
        let data = snapshot.val();
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
    for(player in pointsTable.players){
        points.players[player] = pointsTable.players[player] + livePoints.players[player]
    }
    return points;
}