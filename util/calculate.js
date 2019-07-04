const scraper = require('./scraper.js')
const db = require('./Database').database
exports.calculate = () => {
    db.ref('/').once("value", function(snapshot){
        let data = snapshot.val();
        let matchId = data.currentMatch.matchId
        let matchUrl = data.currentMatch.matchUrl
        let teams = data[matchId];
        let pointsTable = data.points
        var livePoints = data.currentMatch.matchPoints
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
                livePoints.players[team] += points
            }
            livePoints['time'] = Date.now()
            if(data.currentMatch.liveScoreboard){
                db.ref('/currentMatch/matchPoints').set(livePoints)
            }
            else if(data.currentMatch.completion){
                db.ref('/points').set(currentPoints(livePoints, pointsTable))
            }
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