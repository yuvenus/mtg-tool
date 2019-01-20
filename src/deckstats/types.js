import React from 'react';
import ReactDOM from 'react-dom';
import {Chart} from 'primereact/chart';

export default class Types extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="typeDist">
        <Chart type="doughnut" data={this.props.data}/>
      </div>
    )
  }
}
