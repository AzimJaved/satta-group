const scraper = require('./scraper.js')
function calculate(){
   let teams = JSON.parse(fs.readFileSync('../team/teams.json').toString())
    let result = {}, scores = {}
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
        scores[team] = points
    }
    return scores;    
}