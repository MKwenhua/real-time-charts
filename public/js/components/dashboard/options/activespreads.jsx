import React from 'react';

export default class ActiveSpreads extends React.PureComponent {
  constructor(props) {
    super(props);
    this.CTXspread = null;
    this.dbSource = props.dataSource;
    this.state = {
      trackedBids: [],
      onView: false
    };

  }
  componentDidMount() {
    this.CTXspread = this.props.callCT()
    this.CTXspread.seedSpread();
    this.props.setSpreadRef(this.CTXspread);
  }
  render() {
    return (
      <div className='active-spreads'>
        <ul className='spread-labels'>
          <li className='index-li'>Index</li>
          <li>Ask</li>
          <li>Bid</li>
          <li>%</li>
        </ul>
        <canvas id='activeSpreads' width='200' height='650'></canvas>
      </div>
    )
  }
};
