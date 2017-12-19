import React from 'react';

export default class LoadConnect extends React.PureComponent {
  render() {
    return (
      <div className='connecting'>
        <div className='spinner-bn'>
          <div className='bounce1'></div>
          <div className='bounce2'></div>
          <div className='bounce3'></div>
        </div>
        <h2>Connecting to WebSocket. . .
        </h2>
      </div>
    )
  }
};
