const scraper = require('./scraper.js')
const db = require('./Database').database
exports.calculate = () => {
    db.ref('/').once("value", function(snapshot){
        let data = snapshot.val();
        let matchId = data.currentMatch.matchId
        let matchUrl = data.currentMatch.matchUrl
        let teams = data[matchId];
<<<<<<< HEAD
        let pointsTable = data.points
        var livePoints = {
            "players" : {
                "AQIB": 0,
                "Hamza": 0,
                "Sanskar":0,
                "Azim":0,
                "Shrey":0
            }
        }
=======
        // console.log(matchId)
        // console.log(data)
        //let pointsTable = data.points
        var pointsTable = {
            "players" : {"AQIB": 0,
            "Hamza": 0,
            "Sanskar":0,
            "Azim":0,
            "Shrey":0
            }
        }
        //let matchUrl = "https://www.espncricinfo.com/series/8039/scorecard/1144520/england-vs-india-38th-match-icc-cricket-world-cup-2019";
>>>>>>> 614734234fd01401d1fb87e1daa5e7621c880991
        scraper.fetchHtml(matchUrl).then((html) => {
            let result = scraper.parseHtml(html)
            for(team in teams){
                let teamPlayers = teams[team].players, points = 0;
                teamPlayers.forEach(player => {
                    if(result.batsmen[player]!=null){
                        points += parseInt(result.batsmen[player].runs)
                    }
                    if(result.bowlers[player]!=null){
                        points+= parseInt(result.bowlers[player].wickets*20)
                    }
                });
<<<<<<< HEAD
                livePoints.players[team] += points
            }
            livePoints['time'] = Date.now()
            if(data.currentMatch.liveScoreboard){
                db.ref('/currentMatch/matchPoints').set(livePoints)
            }
            if(data.currentMatch.completion){
                db.ref('/points').set(currentPoints(livePoints, pointsTable))
=======
                console.log(team +'/'+ points)
                pointsTable[team] += points
>>>>>>> 614734234fd01401d1fb87e1daa5e7621c880991
            }
            console.log(pointsTable)
            pointsTable['time'] = Date.now()
        })
    })
}

function currentPoints(livePoints, pointsTable){
    var points = {
        "players" : {}
    }
    for(player in pointsTable.players){
        points.players[player] = pointsTable.players[player] + livePoints.players[player]
    }
    return points;
}