import React from 'react';
import ReactDOM from 'react-dom';
import {Chart} from 'primereact/chart';
import countBy from 'lodash/countBy';
import { ProgressSpinner } from 'primereact/progressspinner';
import ManaCurve from '../deckstats/manacurve';
import Colors from '../deckstats/colors';
import Prices from '../deckstats/prices'
import { backgroundColors } from '../bgcolors';
import '../styles/index.scss';

// Use cards collection

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: 'kruphix, god of horizons \nsol ring \nkodama\'s reach \ncoalition relic',
      result: {
        labels: [],
        datasets: [{
          data: []
        }]
      }
    };

    this.onChange = this.onChange.bind(this);
    this.displayResult = this.displayResult.bind(this);
    this.hasData = false;
    this.progress = false;
  }

  onChange(event) {
    this.setState({input: event.target.value});
  }

  displayResult() {
    // Taking the inputs and putting them array with
    // {name: cardName1}, {name: cardName2}, ...
    let cards = this.state.input.split('\n')
      .map(m => ({name: m}));
    let identifiers = {identifiers: cards}

    this.progress = true;

    fetch('https://api.scryfall.com/cards/collection', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify(identifiers)
    }).then(res => res.ok ? res.json() : '')
      .then(response => {
        // grabbing cmcs of cards and dumping into array
        let manaCosts = countBy(response.data.map(m => parseInt(m.cmc, 10)));
        let manaCostYAxis = Array.from(Array(Object.keys(manaCosts)
                  .map(m => parseInt(m, 10))[Object.keys(manaCosts).length - 1]))
          .map((m, i) => `${i + 1}`);
        let manaCostTotals = manaCostYAxis.map(m => Object.keys(manaCosts).includes(m) ?
            manaCosts[parseInt(m, 10)] : 0);
        let maxCost = Math.max(...manaCostTotals);

        let barOptions = {scales: {
                            yAxes: [{
                               ticks: {
                                 max: maxCost > 14 ? maxCost : 10,
                                 min: 0
                               }
                             }]
                           }
                         };

        let data = {
          labels: manaCostYAxis,
          datasets: [{
            label: 'Mana Cost',
            data: manaCostTotals,
            backgroundColor: '#e6194b',
          }]
        }
        this.hasData = true;
        this.progress = false;
        this.setState({result: data, barOptions: barOptions});
        // grab mana costs of everything and organize them into a chart
      });
  }

  // <ul>{this.state.result}</ul>
  // this.setState({result: response.data.map((m, i) =>
  //   <li key={i.toString()}>
  //     <img src={m.image_uris.small} alt={"card" + i} />
  //   </li>)

  render() {
    return (
      <div className="search-container">
        <textarea className="search-input" onChange={this.onChange} value={this.state.input}></textarea>

        <div className="button-container">
          <button className="button primary" onClick={this.displayResult}>Display Me!</button>
          <button className="button default" onClick={this.state.input = ''}>Clear</button>
        </div>

        {this.hasData && <div className="results-display">
          <ManaCurve className="manacurve" data={this.state.result} options={this.state.barOptions}/>
        </div>}
      </div>
    )
  }
}

// ========================================


// kruphix, god of horizons
// swordwise centaur
// prophet of kruphix
// dictate of kruphix
// courser of kruphix
// kydele, chosen of kruphix
// overbeing of myth
// sakura tribe-elder
// forced fruition
