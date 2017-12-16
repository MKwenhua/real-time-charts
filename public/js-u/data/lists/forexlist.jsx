import React from 'react';
import ForexSymbolPairs from 'data/forex_symbol_pairs';

export default class ForexList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exchange: 'NASDAQ'
    }
    this.exchangeChange = this.exchangeChange.bind(this);
  };
  exchangeChange(e) {
    let ex = e.target.value;

    this.setState({exchange: ex});
  }
  handleStart() {
    this.props.startChart(this.refs.feedSymbol.value, 'forex')
  };

  render() {
    let {used} = this.props
    const list = ForexSymbolPairs.map((symbol) => {
      if (used[symbol]) {
        return null;
      } else {
        return <option key={symbol} value={symbol}>{symbol}</option>;
      }
    });
    return (
      <div className='column-two text-center'>
        <div className='sel-ind'>
          <strong>Currency Pairs</strong>
          <select data-type='forex' ref='feedSymbol' className='symbol-pick live-sym'>
            {list}
          </select>
        </div>
        <div className='add-chart-butt-div text-center'>
          <div onClick={this.handleStart.bind(this)} className='cool-button add-chart-bt'>Track</div>
        </div>
      </div>
    )
  }
};
