const scraper = require('./util/scraper.js')
const seriesId = 8089; // World cup


scraper.fetchHtml().then( (html) => {
    var scoreboard = scraper.parseHtml(html)
    console.log(scoreboard)
})


