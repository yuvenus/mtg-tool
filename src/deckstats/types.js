import React from 'react';
import {Chart} from 'primereact/chart';

export default class Types extends React.Component {
  render() {
    return (
      <div className="typeDist">
        <Chart type="doughnut" data={this.props.data}/>
      </div>
    )
  }
}
