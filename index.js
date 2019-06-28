const scraper = require('./util/scraper.js')
const seriesId = 8089; // World cup
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

scraper.fetchHtml().then( (html) => {
    var scoreboard = scraper.parseHtml(html)
    console.log(scoreboard)
})


app.listen(PORT, () => {
    console.log("Booted")
})

