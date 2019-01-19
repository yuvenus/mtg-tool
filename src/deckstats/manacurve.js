import React from 'react';
import ReactDOM from 'react-dom';
import {Chart} from 'primereact/chart';

export default class ManaCurve extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="manacurve">
        <Chart type="bar" data={this.props.data} options={this.props.options} />
      </div>
    )
  }
}
