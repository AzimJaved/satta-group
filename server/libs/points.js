const scraper = require('./scraper')
// const scoring = require('../config.json')
/**
 * @todo Scoring should be on database, changeable by admin
 */

exports.calculate = async (userTeams, scoring) => {
    /*
    Flow: userTeams must include user.username, matchPlayer.playerId, matchPlayer.playerName, match.matchUrl. Key elements are matchId and playerId.
    something like 

    SELECT userTeam.username, matchPlayer.playerId, matchPlayer.playerName, match.matchUrl from user, matchPlayer, match WHERE
    matchPlayer.playerId = userTeam.playerId AND matchPlayer.matchId = userTeam.matchId AND match.matchId = userTeam.matchId;

    */
    let pointsTable = {}
    let scoreboard = await scraper.worker(userTeams[0].matchUrl)
    userTeams.forEach(userTeam => {
        if(pointsTable[userTeam.name] == null){
            pointsTable[userTeam.name] = 0
        }
        scoreboard.batsmen.forEach(batsman => {
            
        })
    })
}
