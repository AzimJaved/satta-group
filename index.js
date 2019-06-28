const scraper = require('./util/scraper.js')
const seriesId = 8089; // World cup
const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser')
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

scraper.fetchHtml().then( (html) => {
    var scoreboard = scraper.parseHtml(html)
    console.log(scoreboard)
})
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html')  
})

app.post('/teams', (req,res) =>{
    // Selected team available as req.body
})

app.listen(PORT, () => {
    console.log("Booted")
})

