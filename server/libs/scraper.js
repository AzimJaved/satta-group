const cheerio = require('cheerio');
const request = require('request')

/**
 * @todo Try to combine the scoreboard elements to have runs and scores in the same element
 */

/**
 * @function parseHtml Parses the given espncricinfo.com HTML code and returns the playerwise scoreboard
 * @param matchHtml The HTML code
*/
function parseHtml(matchHtml) {
    const $ = cheerio.load(matchHtml)
    var batsmenScore = {}
    var bowlersScore = {}
    var batsmen = []
    var bowlers = []
    // First innings
    $("[id='gp-inning-00']").find("[class='wrap batsmen']").each(function (index, element) {
        batsmen.push(element)
    })
    $("[id='gp-inning-00']").find("[class='scorecard-section bowling']").each(function (index, element) {
        bowlers.push(element.children[0].children[1].children)
    })
    // Second Innings
    $("[id='gp-inning-01']").find("[class='wrap batsmen']").each(function (index, element) {
        batsmen.push(element)
    })
    $("[id='gp-inning-01']").find("[class='scorecard-section bowling']").each(function (index, element) {
        bowlers.push(element.children[0].children[1].children)
    })
    // generate batsmen json.
    for (let i = 0; i < batsmen.length; i++) {
        var name = batsmen[i].children[0].children[0].children[0].data
        if (name.includes(' †')) {
            name = name.split(' †')[0]
        }
        if (name.includes(' (c)')) {
            name = name.split(' (c)')[0]
        }
        var batsmanJson = {
            name: name,
            runs: batsmen[i].children[2].children[0].data
        }
        batsmenScore[name] = batsmanJson
    }
    // generate bowler json
    for (let j = 0; j < bowlers.length; j++) {
        for (let i = 0; i < bowlers[j].length; i++) {
            var name = bowlers[j][i].children[0].children[0].children[0].data
            if (name.includes(' †')) {
                name = name.split(' †')[0]
            }
            if (name.includes(' (c)')) {
                name = name.split(' (c)')[0]
            }
            var bowlerJson = {
                name: name,
                wickets: bowlers[j][i].children[5].children[0].data,
            }
            bowlersScore[name] = bowlerJson
        }
    }
    return { batsmen: batsmenScore, bowlers: bowlersScore }
}

/**
 * @function fetchHtml Returns the HTML code of the given url
 * @param matchUrl URL.
 */
async function fetchHtml(matchUrl) {
    return new Promise((resolve, reject) => {
        request.get(matchUrl, (err, response, html) => {
            if (err) {
                throw err
            }
            resolve(html)
        })
    })
}

exports.worker = async (matchUrl) => {
    /**
     * @function scraper driver function to scrape scores from espncricinfo
     * @param matchUrl URL of the match to be scraped
     */
    let HTML = await fetchHtml(matchUrl)
    let scoreboard = parseHtml(HTML)
    console.log(scoreboard)
    return scoreboard
}