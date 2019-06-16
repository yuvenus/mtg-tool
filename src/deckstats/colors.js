import React from 'react';
import {Chart} from 'primereact/chart';

export default class Colors extends React.Component {
  render() {
    return (
      <div className="colorDist">
        <Chart type="pie" data={this.props.data} />
      </div>
    )
  }
}
