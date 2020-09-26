
import React from 'react';
import Checkbox from './Checkbox/Checkbox.tsx';
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
                <Checkbox options={this.state.batsmen} onChange={this.choose} />
                
                <h2>Bowler</h2>

                <Checkbox options={this.state.bowlers} onChange={this.choose} />

                <h2> Wicket Keepers</h2>

                <Checkbox options={this.state.wk} onChange={this.choose} />

                <button className="btn btn-satta" disabled={! (this.state.selected === 11)} onClick={(event)=>{event.preventDefault(); this.submitsatta(event)}}>Submit Satta</button>
            </form>
        </div>);
    }

    submitsatta = (e)=>{
        console.log("submitting satta");
    }

    choose = (e)=>{
        this.setState({selected: this.state.selected + 1});
        console.log(this.state.selected)
    };

}

//TODO: Fetch players from the server.


export default SattaForm;