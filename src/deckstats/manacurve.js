import React from 'react';
import {Chart} from 'primereact/chart';

export default class ManaCurve extends React.Component {
  render() {
    return (
      <div className="manacurve">
        <Chart type="bar" data={this.props.data} options={this.props.options} />
      </div>
    )
  }
}
