import React from 'react';
import ReactDOM from 'react-dom';
import Search from './search/search';

const root = document.getElementById('app');

class Main extends React.Component<any, any> {
    render() {
        return (
          <Search />//Return our new HelloWorld component
        );
    }
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
