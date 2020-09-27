const scraper = require('./scraper')
// const scoring = require('../config.json')
/**
 * @function calculate Calculate team points
 * @param userTeams UserTeam data. Check Schema in points.js
 * @param scoring scoring config
 */

exports.calculate = async (userTeams, scoring) => {
    /*
    Flow: userTeams must include user.username, matchPlayer.playerId, matchPlayer.playerName, match.matchUrl. Key elements are matchId and playerId.
    something like 

    SELECT userTeam.username, matchPlayer.playerId, matchPlayer.playerName, match.matchUrl from user, matchPlayer, match WHERE
    matchPlayer.playerId = userTeam.playerId AND matchPlayer.matchId = userTeam.matchId AND match.matchId = userTeam.matchId;

    */
    /*
     userTeams schema i hope = {
         matchUrl: matchUrl
         users: [
         {username: username, totalScore: 69, team: [{name: playerName, captain: false}]}
         ]
     }
    */
    let pointsTable = {}, multiplier = 1
    let scoreboard = await scraper.cricinfoWorker(userTeams.matchUrl)
    // console.log(scoreboard)
    userTeams.users.forEach(user => {
        pointsTable[user.username] = {}
        pointsTable[user.username].currentScore = 0
        pointsTable[user.username].totalScore = user.totalScore
        user.team.forEach(playerName => {
        
            // console.log(scoreboard.batsmen[playerName.name]);
            if(playerName.captain){
                multiplier = scoring.captainMultiplier
            } else {
                multiplier = 1
            }
            if(scoreboard.batsmen[playerName.name] != null){
                // console.log("here")
                // console.log(scoreboard.batsmen[playerName.name])
                pointsTable[user.username].currentScore += multiplier*scoring.run*scoreboard.batsmen[playerName.name].runs
            }
            if(scoreboard.bowlers[playerName] != null){
                pointsTable[user.username].currentScore += multiplier*scoring.wicket*scoreboard.bowlers[playerName.name].wickets
            }
        })
        pointsTable[user.username].totalScore += pointsTable[user.username].currentScore
        console.log(pointsTable[user.username]);
    })
    pointsTable
    return pointsTable
}
