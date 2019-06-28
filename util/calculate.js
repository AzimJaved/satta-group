const scraper = require('./scraper.js')
const GSheets = require('./GSheets.js')
exports.calculate = () => {
    let teams = JSON.parse(fs.readFileSync('../team/teams.json').toString())
    let result = {}, scores = {}
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
    //       teams = {
    //           "Shrey" :{
    //               playerName : "Shrey",
    //               players : ['Liton Das', 'Shakib Al Hasan']
    //           },
    //           "Azim" :{
    //               playerName : "Azim",
    //               players : ['Rahmat Shah', 'Rashid Shah']
    //           }
    //       }
    scraper.fetchHtml().then((html) => {
        result = scraper.parseHtml(html)
    })
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
        GSheets.AppendToSpreadsheet([{
            ssId : '1RukCXKwioYsgMqJoFMjvf9md0r5airmYWV8k_PzzRNI',
            sheet : 'satta',
            values : [ team, points ]
        }])
        scores[team] = points
    } 
}