const cheerio = require('cheerio');
const request = require('request');
const seriesId = 8089; // World cup


fetchHtml().then( (html) => {
    parseHtml(html)
})

function parseHtml(matchHtml){
    const $ = cheerio.load(matchHtml)
    var scorecards = []
    $("[data-reactid='177']").find("[class='sub-module scorecard']").each( function(index, element){
        scorecards.push(element.children[0].children[0].children[1])
    })
    var batsmen;
    for(let j=0; j<scorecards.length; j++){
        for(let i=0; i<scorecards[j].children[0].children.length; i++){
            batsmen[i][j] = scorecards[j].children[0].children[i]
        }
    }
    console.log(batsmen); 
}

function fetchHtml(){
    return new Promise( (resolve, reject) =>   {
        // var matchUrl =  'https://www.espncricinfo.com/series/'+seriesId+'/scorecard/'+matchId+'/'+matchDesc;
        var matchUrl = 'https://www.espncricinfo.com/series/8039/scorecard/1144513/afghanistan-vs-bangladesh-31st-match-icc-cricket-world-cup-2019' 
        var matchHtml = ''
        request.get(matchUrl, (error, response, html) =>{
            if(!error){
                resolve(html)
            }
            else {
                console.log(error)
                reject(error)
            }
        })
    })
}

