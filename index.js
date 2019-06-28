const express = require('express');
const app = express();
const fs = require('fs');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

const scraper = require('./util/scraper.js')
const seriesId = 8089; // World cup

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('views', path.join(__dirname, 'homepage'))
app.set('view engine', 'hbs')
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/pages/layouts',
    partialsDir: [
        __dirname + '/pages/partials'
    ]
}))

scraper.fetchHtml().then( (html) => {
    var scoreboard = scraper.parseHtml(html)
    console.log(scoreboard)
})
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/pages/index.html')  
})

app.post('/teams', (req,res) =>{
    // Selected team available as req.body
    console.log(req.body)
    res.sendFile(__dirname +'/pages/success')
})

app.listen(PORT, () => {
    console.log("Booted")
})

