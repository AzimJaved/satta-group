
import React from 'react';
import Checkbox from './Checkbox/Checkbox.jsx';



class SattaForm extends React.Component {
    serverEndpoint = require('../config.json').APIConfig.baseURL
    state = {
        loading: false,
        alreadySelected: false,
        selected: 0,
        batsmen: ['Warner', 'Azim', 'Shrey'],
        bowlers: ['Warner', 'Azim', 'Shrey'],
        wk: ['Warner', 'Azim', 'Shrey'],
        selectedBatsmen: [],
        selectedBowlers: [],
        selectedWK: []
    };

    componentDidMount() {
        fetch(
            this.serverEndpoint + '/fetchPlayers'
        ).then(respose => respose.json())
            .then(data => {
                if (data != null) {
                    let batsmen = [], bowlers = [], wk = []
                    data.forEach(player => {
                        if (player.type === 'bat') {
                            batsmen.push(player.name);
                        } else if (player.type === 'bowl') {
                            bowlers.push(player.name)
                        } else if (player.type === 'wk'){
                            wk.push(player.name)
                        }
                    })
                    this.setState({ batsmen: batsmen, bowlers: bowlers, wk: wk, loading: false })
                }
            })
    }
    choose = (event) => {
        let batsmen = this.state.selectedBatsmen, bowlers = this.state.selectedBowlers, wk = this.state.selectedWK, index = -1
        console.log(event.target.checked)
        if (event.target.checked) {
            switch (event.target.name) {
                case 'batsmen': batsmen.push(event.target.value)
                    break
                case 'bowlers': bowlers.push(event.target.value)
                    break
                case 'wk': wk.push(event.target.value)
                    break
                default: break
            }
        } else {
            switch (event.target.name) {
                case 'batsmen': index = batsmen.indexOf(event.target.value)
                    if (index > -1) {
                        batsmen.splice(index, 1)
                    }

                    break
                case 'bowlers': index = bowlers.indexOf(event.target.value)
                    if (index > -1) {
                        bowlers.splice(index, 1)
                    }
                    break
                case 'wk': index = wk.indexOf(event.target.value)
                    if (index > -1) {
                        wk.splice(index, 1)
                    }
                    break
                default: break
            }
        }
        this.setState({ selectedBatsmen: batsmen, selectedBowlers: bowlers, selectedWK: wk, selected: this.state.selected + 1 });
    }

    submitSatta = () => {
        console.log("submitting satta");
        fetch(
            this.serverEndpoint + '/submitSatta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: [...this.state.batsmen, ...this.state.bowlers, ...this.state.wk]
        }
        ).then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.setState({ alreadySelected: true })
                }
            })

    }
    render() {
        return (
            this.state.loading ? (<div>Loading, Ruk zara</div>) : (
                <div className="sattaform">
                    <form>
                        <h2>Batsmen</h2>
                        <Checkbox name={'batsmen'} options={this.state.batsmen} onChange={(event) => { this.choose(event) }} />

                        <h2>Bowler</h2>

                        <Checkbox name={'bowlers'} options={this.state.bowlers} onChange={(event) => { this.choose(event) }} />

                        <h2> Wicket Keepers</h2>

                        <Checkbox name={'wk'} options={this.state.wk} onChange={(event) => { this.choose(event) }} />

                        <button className="btn btn-satta" disabled={!(this.state.selected === 11)} onClick={(event) => { event.preventDefault(); this.submitSatta() }}>Submit Satta</button>
                    </form>
                </div>
            )
        )
    }

}


export default SattaForm;