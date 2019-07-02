const cheerio = require('cheerio');
const request = require('request')
exports.parseHtml = (matchHtml) => {
    const $ = cheerio.load(matchHtml)
    var batsmenJson = {}
    var bowlersJson = {}
    var batsmen = [  ]
    var bowlers = [  ]
    // First innings
    $("[id='gp-inning-00']").find("[class='wrap batsmen']").each( function(index, element){
        batsmen.push(element)
    })
    $("[id='gp-inning-00']").find("[class='scorecard-section bowling']").each( function(index, element){
           bowlers.push(element.children[0].children[1].children)
    })
    // Second Innings
    $("[id='gp-inning-01']").find("[class='wrap batsmen']").each( function(index, element){
        batsmen.push(element)
    })
    $("[id='gp-inning-01']").find("[class='scorecard-section bowling']").each( function(index, element){ 
        bowlers.push(element.children[0].children[1].children)
    })
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
    for(let j=0; j<bowlers.length; j++){
        for(let i=0; i<bowlers[j].length; i++){
            var name = bowlers[j][i].children[0].children[0].children[0].data
            if(name.includes(' †')){
                name = name.split(' †')[0]
            }
            if(name.includes(' (c)')){
                name = name.split(' (c)')[0]
            }
            var bowlerJson = {
                name : name,
                wickets: bowlers[j][i].children[5].children[0].data,
            }
            bowlersJson[bowlerJson.name] = bowlerJson
        }
    }
    var scorecard = {
        batsmen : batsmenJson,
        bowlers : bowlersJson
    }
    return scorecard;
}

exports.fetchHtml = (matchUrl) => {
    return new Promise( (resolve, reject) =>   {
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