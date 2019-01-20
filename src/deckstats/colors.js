import React from 'react';
import ReactDOM from 'react-dom';
import {Chart} from 'primereact/chart';

export default class Colors extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="colorDist">
        <Chart type="pie" data={this.props.data} />
      </div>
    )
  }
}
