import React from 'react';
import ReactDOM from 'react-dom';
import {Chart} from 'primereact/chart';
import countBy from 'lodash/countBy';
import { ProgressSpinner } from 'primereact/progressspinner';
import ManaCurve from '../deckstats/manacurve';
import Colors from '../deckstats/colors';
import Types from '../deckstats/types';
import Prices from '../deckstats/prices';
import { backgroundColors, manaColors } from '../bgcolors';
import '../styles/index.scss';

// Use cards collection

export default class Search extends React.Component {
  state = {
    input: 'kruphix, god of horizons \nsol ring \nkodama\'s reach \ncoalition relic \nrise of the dark realms \nmana barbs \npath to exile',
    manaCurve: {
      barOptions: {},
      labels: [],
      datasets: [{
        data: []
      }]
    },
    colorDist: {
      labels: [],
      datasets: [{
        data: []
      }]
    },
    typeDist: {
      labels: [],
      datasets: [{
        data: []
      }]
    },
    hasData: false,
    progress: false
  };

  handleChange = event => this.setState({input: event.target.value});

  displayResult = () => {
    // Taking the inputs and putting them array with
    // {name: cardName1}, {name: cardName2}, ...
    // so that the API can handle the input
    let cards = this.state.input.split('\n')
      .map(m => ({name: m}));
    let identifiers = {identifiers: cards}

    this.setState({progress: true});

    fetch('https://api.scryfall.com/cards/collection', {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify(identifiers)
    }).then(res => res.ok ? res.json() : '')
      .then(response => {
        let curve = this.getManaCurve(response.data);
        let color = this.getColorDist(response.data);
        let type = this.getTypeDist(response.data);

        this.setState({
          manaCurve: curve, colorDist: color, typeDist: type,
          hasData: true,
          progress: false
        });
        // grab mana costs of everything and organize them into a chart
      });
  }

  // calculate mana curve
  getManaCurve = res => {
    // grabbing cmcs of cards and dumping into array
    // countBy counts all instances of each item in the Array
    // but there can be gaps, i.e. if there aren't cards with CMC 2
    // so we fill it in by ourselves
    let manaCosts = countBy(res.map(m => parseInt(m.cmc, 10))); // counting instances of each mana cost
    let manaCostXAxis = Array.from(Array(Object.keys(manaCosts)
              .map(m => parseInt(m, 10))[Object.keys(manaCosts).length - 1]))
      .map((m, i) => `${i + 1}`); // filling in the missing mana costs
    let manaCostTotals = manaCostXAxis.map(m => Object.keys(manaCosts).includes(m) ?
        manaCosts[parseInt(m, 10)] : 0);
    let maxCost = Math.max(...manaCostTotals);

    // setting the axes of the bar graph
    let barOptions = {scales: {
                        xAxes: [{
                          scaleLabel: {
                            display: true,
                            labelString: 'Mana Cost'
                          }
                        }],
                        yAxes: [{
                           scaleLabel: {
                             display: true,
                             labelString: 'Total # Of Cards'
                           },
                           ticks: {
                             stepSize: 1,
                             max: maxCost,
                             min: 0
                           }
                         }]
                       }
                     };

    // combining all the data together
    // bar options: axis info
    // labels: x-axis label
    let data = {
      barOptions: barOptions,
      labels: manaCostXAxis,
      datasets: [{
        label: 'Mana Cost',
        data: manaCostTotals,
        backgroundColor: backgroundColors[0]
      }]
    }

    return data;
  }

  // caculate color distribution
  getColorDist = res => {
    var colors = ["W", "U", "B", "R", "G"];
    // add "C" back in if we want it

    // combine all colors into one array and count all instances of said colors
    // "C" == colorless
    var cardColors = countBy(res.map(m => m.colors.length > 0 ? m.colors : ["C"])
                                .reduce((acc, cur) => acc.concat(cur), []))

    // filling in the missing colors with 0
    var allColors = {
      "W": cardColors.hasOwnProperty("W") ? cardColors["W"] : 0,
      "U": cardColors.hasOwnProperty("U") ? cardColors["U"] : 0,
      "B": cardColors.hasOwnProperty("B") ? cardColors["B"] : 0,
      "R": cardColors.hasOwnProperty("R") ? cardColors["R"] : 0,
      "G": cardColors.hasOwnProperty("G") ? cardColors["G"] : 0,
      // "C": cardColors.hasOwnProperty("C") ? cardColors["C"] : 0
    }

    // converting the object to an array of numbers (for display purposes)
    var colorValues = Object.keys(allColors).map(m => allColors[m]);

    let data = {
      labels: colors,
      datasets: [{
        label: 'Color Distribution',
        data: colorValues,
        backgroundColor: manaColors,
      }]
    }

    return data;
  }

  // calculate type distribution (artifacts, enchantments, etc.)
  getTypeDist = res => {
    let types = ["Artifact", "Creature", "Enchantment", "Instant", "Land", "Planeswalker", "Sorcery"];

    // separating out the type line into types that exist in the types array
    let typeArray = res
      .map(m => m.type_line.split(" ").filter(f => types.includes(f)))
      .reduce((acc, cur) => acc.concat(cur), []);

    // counting occurences of the types
    let cardTypes = countBy(typeArray);

    // filling in the missing types with 0
    let allTypes = {
      "Artifact": cardTypes.hasOwnProperty("Artifact") ? cardTypes["Artifact"] : 0,
      "Creature": cardTypes.hasOwnProperty("Creature") ? cardTypes["Creature"] : 0,
      "Enchantment": cardTypes.hasOwnProperty("Enchantment") ? cardTypes["Enchantment"] : 0,
      "Instant": cardTypes.hasOwnProperty("Instant") ? cardTypes["Instant"] : 0,
      "Land": cardTypes.hasOwnProperty("Land") ? cardTypes["Land"] : 0,
      "Planeswalker": cardTypes.hasOwnProperty("Planeswalker") ? cardTypes["Planeswalker"] : 0,
      "Sorcery": cardTypes.hasOwnProperty("Sorcery") ? cardTypes["Sorcery"] : 0,
    }

    // converting the object to an array of numbers (for display purposes)
    var typeValues = Object.keys(allTypes).map(m => allTypes[m]);

    let data = {
      labels: types,
      datasets: [{
        label: 'Type Distribution',
        data: typeValues,
        backgroundColor: backgroundColors.slice(1, 8)
      }]
    }

    return data;
  }

  clear = () => this.setState({input: '', hasData: false});

  render() {
    return (
      <div className="search-container">
        {/* CONVENTION IS onChange={this.handleChange} */}
        <textarea className="search-input" onChange={this.handleChange} value={this.state.input}></textarea>

        <div className="button-container">
          <button className={`button primary ${this.state.input === '' ? 'disabled' : ''}`}
                  onClick={this.displayResult}
                  disabled={this.state.input === ''}>Display Me!</button>
          <button className="button default"
                  onClick={this.clear}>Clear</button>
        </div>

        {/* won't render properly unless you make sure there's data */}
        {this.state.hasData && !this.state.progress &&
          <div className="results-display">
            <ManaCurve className="manacurve" data={this.state.manaCurve} options={this.state.manaCurve.barOptions}/>
            <Colors className="colorDist" data={this.state.colorDist}/>
            <Types className="typeDist" data={this.state.typeDist}/>
          </div>
        }
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
