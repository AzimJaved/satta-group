const express = require('express');
const app = express();
const fs = require('fs');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path')
const PORT = process.env.PORT || 3000;

const scraper = require('./util/scraper.js')
const seriesId = 8089; // World cup

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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


scraper.fetchHtml().then( (html) => {
    var scoreboard = scraper.parseHtml(html)
    console.log(scoreboard)
})

app.get('/', (req,res) => {
    // _data is to be fetched from firebase ig lmao. _data is array of players in squads
    _data = [ "Liton Das","Tamim Iqbal", "Shakib Al Hasan","Mushfiqur Rahim","Soumya Sarkar","Mahmudullah","Mosaddek Hossain","Mohammad Saifuddin","Mehidy Hasan Miraz","Mashrafe Mortaza","Mustafizur Rahman",
    "Gulbadin Naib","Rahmat Shah", "Hasmatullah Shahidi","Asghar Afghan","Mohammad Nabi","Samiullah Shinwari","Ikram Alikhil","Najbullah Zadran","Rashid Khan","Dawlat Zadran","Mujeeb Ur Rahman"  ]
    res.render('index',{
        data : _data,
        title : 'Satta Group'
    })  
})

app.post('/teams', (req,res) =>{
    // Selected team available as req.body
    console.log(req.body)
    res.send("lol")
})

app.listen(PORT, () => {
    console.log("Booted")
})

