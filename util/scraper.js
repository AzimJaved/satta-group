const cheerio = require('cheerio');
const request = require('request')
exports.parseHtml = (matchHtml) => {
    const $ = cheerio.load(matchHtml)
    var batsmenJson = {}
    var bowlersJson = {}
    var batsmen = [  ]
    var bowlers = [  ]
    /* TODO : Also need to add players who did not bat or ball over here or suitably adjust in later code */
    // First innings
    flag = true
    $("[id='gp-inning-00']").find("[class='wrap batsmen']").each( function(index, element){
        batsmen.push(element)
    })
    $("[id='gp-inning-00']").find("tr").each( function(index, element){
        if(flag){
            flag = false 
        }
        else {bowlers.push(element)}
    })
    // Second Innings
    flag = true
    $("[id='gp-inning-01']").find("[class='wrap batsmen']").each( function(index, element){
        batsmen.push(element)
    })
    $("[id='gp-inning-01']").find("tr").each( function(index, element){
        if(flag){
            flag = false 
        }
        else {bowlers.push(element)}
    })
    console.log(bowlers.length)
    // generate batsmen json.
    for(let i=0; i<batsmen.length; i++){
        var name = batsmen[i].children[0].children[0].children[0].data
        if(name.includes(' †')){
            name = name.split(' †')[0]
        }
        if(name.includes(' (c)')){
            name = name.split(' (c)')[0]
        }
        var batsmanJson = {
            name : name,
            runs : batsmen[i].children[2].children[0].data
        }
        batsmenJson[batsmanJson.name] = batsmanJson
    }
    // generate bowler json
    for(let i=0; i<bowlers.length; i++){
        var name = bowlers[i].children[0].children[0].children[0].data
        if(name.includes(' †')){
            name = name.split(' †')[0]
        }
        if(name.includes(' (c)')){
            name = name.split(' (c)')[0]
        }
        var bowlerJson = {
            name : name,
            wickets: bowlers[i].children[5].children[0].data,
        }
        bowlersJson[bowlerJson.name] = bowlerJson
    }
    var scorecard = {
        batsmen : batsmenJson,
        bowlers : bowlersJson
    }
    return scorecard;
}

exports.fetchHtml = () => {
    return new Promise( (resolve, reject) =>   {
        // var matchUrl =  'https://www.espncricinfo.com/series/'+seriesId+'/scorecard/'+matchId+'/'+matchDesc;
        var matchUrl = 'https://www.espncricinfo.com/series/8039/scorecard/1144513/afghanistan-vs-bangladesh-31st-match-icc-cricket-world-cup-2019' 

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