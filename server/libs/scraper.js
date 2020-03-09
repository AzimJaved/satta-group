const cheerio = require('cheerio');
const request = require('request')

/**
 * @todo Try to combine the scoreboard elements to have runs and scores in the same element
 */

/**
 * @function parseHtml_cricinfo Parses the given espncricinfo.com HTML code and returns the playerwise scoreboard
 * @param matchHtml The HTML code
*/
function parseHtml_cricinfo(matchHtml) {
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


async function parseHtml_cricbuzz(HTML){
    const $ = cheerio.load(HTML)
    let batsmen = []
    let bowlers = []
    let batsmenJson = {}
    let bowlersJson = {}
    // batsmanName = 
    // console.log(batsmen[0].children[1].children[1].children[0].data)
    $("#innings_1").find("[class~='cb-ltst-wgt-hdr']:nth-of-type(1)").find("[class~='cb-scrd-itms']").each((index, batsman) =>{
        if(batsman.children[1].children[1]){
            batsmen.push(batsman)
        }
    })
    $("#innings_1").find("[class~='cb-ltst-wgt-hdr']:nth-of-type(4)").find("[class~='cb-scrd-itms']").each((index, bowler) =>{
        if(bowler.children[1].children[1]){
            bowlers.push(bowler)
        }
    })
    $("#innings_2").find("[class~='cb-ltst-wgt-hdr']:nth-of-type(1)").find("[class~='cb-scrd-itms']").each((index, batsman) =>{
        if(batsman.children[1].children[1]){
            batsmen.push(batsman)
        }
    })
    $("#innings_2").find("[class~='cb-ltst-wgt-hdr']:nth-of-type(4)").find("[class~='cb-scrd-itms']").each((index, bowler) =>{
        if(bowler.children[1].children[1]){
            bowlers.push(bowler)
        }
    })
    for(let i=0; i < batsmen.length; i++){
        let name = batsmen[i].children[1].children[1].children[0].data.substr(1)
        let batsmanJson = { name: name, runs: batsmen[i].children[5].children[0].data }
        batsmenJson[name] = batsmanJson
    }
    for(let i=0; i < bowlers.length; i++){
        let name = bowlers[i].children[1].children[1].children[0].data.substr(1)
        let bowlerJson = { name: name, wickets: bowlers[i].children[9].children[0].data }
        bowlersJson[name] = bowlerJson
    }

    let scoreboard = {batsmen: batsmenJson, bowlers: bowlersJson}
    // Squads
    let players = {team1: [], team2: []}
    //BUG: nth-of-type selector doesn't work for some reason, and there is currently no way to differentiate benched and other players.
    $("[class~='cb-minfo-tm-nm']").find("[class='margin0 text-black text-hvr-underline']").each((index, player) => {
        if(index < 11)
            players.team1.push(player.children[0].data)
        else if (index > 11 && index < 27)
            players.team2.push(player.children[0].data)
    })
    console.log(players)
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

/**
 * @function cricinfoWorker driver function to scrape scores from espncricinfo
 * @param matchUrl URL of the match to be scraped
*/
exports.cricinfoWorker = async (matchUrl) => {
    let HTML = await fetchHtml(matchUrl)
    let scoreboard = parseHtml(HTML)
    console.log(scoreboard)
    return scoreboard
}

exports.cricbuzzWorker = async (matchId) => {
    /** 
     * @function cricbuzzWorker driver function to scrape scores and teams from cricbuzz
     * @param matchId cricbuzz matchId from URL
    */
   let url = `https://www.cricbuzz.com/api/html/cricket-scorecard/${matchId}`
   let HTML = await fetchHtml(url)
   parseHtml_cricbuzz(HTML)
}