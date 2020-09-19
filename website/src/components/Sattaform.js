
import React from 'react';
import Checkbox from './Checkbox/Checkbox';
import './Checkbox/Checkbox.css';

class SattaForm extends React.Component {
    state = {
        selected: 0,
        batsmen: ['David Warner', 'Shrey', 'Azim'], bowlers: ['David Warner', 'Shrey', 'Azim'], wk: ['David Warner', 'Shrey', 'Azim']
    };
    render() {
        return (<div className="sattaform">
            <form>
                <h2>Batsmen</h2>
                <Checkbox options={this.state.batsmen} onChange={choose}/>
                
                <h2>Bowler</h2>

                <Checkbox options={this.state.bowlers} onChange={choose} />

                <h2> Wicket Keepers</h2>

                <Checkbox options={this.state.wk} onChange={choose} />

                <button className="btn btn-satta">Submit Satta</button>
            </form>
        </div>);
    }

}

function choose(e){

    
}
//TODO: Fetch players from the server.


export default SattaForm;