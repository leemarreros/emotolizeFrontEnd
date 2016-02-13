'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/Login';

class Emotolize extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="globalWrapper">
        <Login />
      </div>
      );
  }
};


ReactDOM.render(<Emotolize />, document.getElementById('react'));
