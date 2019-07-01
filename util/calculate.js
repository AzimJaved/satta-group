const scraper = require('./scraper.js')
const db = require('./Database').database
exports.calculate = () => {
   // let teams = JSON.parse(fs.readFileSync('../teams/teams.json').toString())
    // result = { batsmen:
    //     { 'Liton Das': { name: 'Liton Das', runs: '16' },
    //       'Tamim Iqbal': { name: 'Tamim Iqbal', runs: '36' },
    //       'Shakib Al Hasan': { name: 'Shakib Al Hasan', runs: '51' },
    //       'Mushfiqur Rahim': { name: 'Mushfiqur Rahim', runs: '83' },
    //       'Soumya Sarkar': { name: 'Soumya Sarkar', runs: '3' },
    //       Mahmudullah: { name: 'Mahmudullah', runs: '27' },
    //       'Mosaddek Hossain': { name: 'Mosaddek Hossain', runs: '35' },
    //       'Mohammad Saifuddin': { name: 'Mohammad Saifuddin', runs: '2' },
    //       'Gulbadin Naib': { name: 'Gulbadin Naib', runs: '47' },
    //       'Rahmat Shah': { name: 'Rahmat Shah', runs: '24' },
    //       'Hashmatullah Shahidi': { name: 'Hashmatullah Shahidi', runs: '11' },
    //       'Asghar Afghan': { name: 'Asghar Afghan', runs: '20' },
    //       'Mohammad Nabi': { name: 'Mohammad Nabi', runs: '0' },
    //       'Samiullah Shinwari': { name: 'Samiullah Shinwari', runs: '49' },
    //       'Ikram Alikhil': { name: 'Ikram Alikhil', runs: '11' },
    //       'Najibullah Zadran': { name: 'Najibullah Zadran', runs: '23' },
    //       'Rashid Khan': { name: 'Rashid Khan', runs: '2' },
    //       'Dawlat Zadran': { name: 'Dawlat Zadran', runs: '0' },
    //       'Mujeeb Ur Rahman': { name: 'Mujeeb Ur Rahman', runs: '0' } },
    //    bowlers:
    //     { 'Mujeeb Ur Rahman': { name: 'Mujeeb Ur Rahman', wickets: '3' },
    //       'Dawlat Zadran': { name: 'Dawlat Zadran', wickets: '1' },
    //       'Mohammad Nabi': { name: 'Mohammad Nabi', wickets: '1' },
    //       'Gulbadin Naib': { name: 'Gulbadin Naib', wickets: '2' },
    //       'Rashid Khan': { name: 'Rashid Khan', wickets: '0' },
    //       'Rahmat Shah': { name: 'Rahmat Shah', wickets: '0' },
    //       'Mashrafe Mortaza': { name: 'Mashrafe Mortaza', wickets: '0' },
    //       'Mustafizur Rahman': { name: 'Mustafizur Rahman', wickets: '2' },
    //       'Mohammad Saifuddin': { name: 'Mohammad Saifuddin', wickets: '1' },
    //       'Shakib Al Hasan': { name: 'Shakib Al Hasan', wickets: '5' },
    //       'Mehidy Hasan Miraz': { name: 'Mehidy Hasan Miraz', wickets: '0' },
    //       'Mosaddek Hossain': { name: 'Mosaddek Hossain', wickets: '1' } } }

   db.ref('/').once("value", function(snapshot){
        let data = snapshot.val();
        let matchId = data.currentMatch.matchId + ' '
        let matchUrl = data.currentMatch.matchUrl
        let teams = data[matchId];
        // console.log(matchId)
        // console.log(data)
        let pointsTable = data.points
        // var pointsTable = {
        //     "players" : {"AQIB": 0,
        //     "Hamza": 0,
        //     "Sanskar":0,
        //     "Azim":0,
        //     "Shrey":0
        //     }
        // }
        //let matchUrl = "https://www.espncricinfo.com/series/8039/scorecard/1144520/england-vs-india-38th-match-icc-cricket-world-cup-2019";
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
        //        console.log(team +'/'+ points)
                pointsTable.players[team] += points
            }
        //    console.log(pointsTable)
            if(false){
                pointsTable['time'] = Date.now()
                //db.ref('/points').set(pointsTable)
            }
        })
    })
}