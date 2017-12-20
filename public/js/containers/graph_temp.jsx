import React from 'react';

export default class Graph extends React.PureComponent {
  render() {
    return (
      <div className='container'>
        <div className='col-xs-12 just-so-you-know'>
          <p>Note: I temporarily removed the historical graph for two reasons</p>
          <ol>
            <li>The market data API free trial expired(so I don't have up-to-date data to display)</li>
            <li>Removing this will allow me to cut off generally unused dependencies</li>
          </ol>
          <p>
            <strong>Sorry!</strong>
          </p>
        </div>
      </div>
    )
  }
};
