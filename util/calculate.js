const scraper = require('./scraper.js')
const db = require('./Database').database
exports.calculate = () => {
    return new Promise( (resolve, reject) => {
        db.ref('/').once("value", function(snapshot){
            let data = snapshot.val();
            let matchId = data.currentMatch.matchId
            let matchUrl = data.currentMatch.matchUrl
            let teams = data[matchId];
            let pointsTable = data.points
            var pointsJson = {}
            pointsJson['livePoints'] = data.currentMatch.matchPoints
            pointsJson['playerWise'] = {}
            scraper.fetchHtml(matchUrl).then((html) => {
                let result = scraper.parseHtml(html)
                for(team in teams){
                    let teamPlayers = teams[team].players, points = 0;
                    let teamPoints = {}
                    teamPlayers.forEach(player => {
                        if(result.batsmen[player]!=null){
                            points += parseInt(result.batsmen[player].runs)
                            if(points>0){
                                teamPoints[player] = parseInt(result.batsmen[player].runs)
                            }
                        }
                        if(result.bowlers[player]!=null){
                            points+= parseInt(result.bowlers[player].wickets*20)
                            if(points>0){
                                teamPoints[player] = parseInt(result.bowlers[player].wickets*20)
                            }
                        }
                    });
                    pointsJson.playerWise[team] = teamPoints
                    pointsJson.livePoints.players[team] = points
                }
                pointsJson.livePoints['time'] = Date.now()
                data.currentMatch.matchPoints = pointsJson.livePoints
                data.currentMatch.playerPoints = pointsJson.playerWise
                if(data.currentMatch.liveScoreboard){
                    db.ref('/currentMatch/').set(data.currentMatch)
                    resolve(pointsJson.livePoints)
                }
                else if(data.currentMatch.completion){
                    db.ref('/points').set(currentPoints(pointsJson.livePoints, pointsTable))
                    resolve(pointsJson.livePoints)
                }
            })
        })
    })
}

function currentPoints(livePoints, pointsTable){
    var points = {
        "players" : {}
    }
    for(player in livePoints.players){
        points.players[player] = pointsTable.players[player] + livePoints.players[player]
    }
    return points;
}