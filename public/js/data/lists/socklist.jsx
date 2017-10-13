import React from 'react';
import exchangeSymbols from 'data/gosymbols';

export default class StockList extends React.PureComponent {
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
    this.props.startChart(this.refs.feedSymbol.value, 'stocks')
  };
  render() {
    let {used} = this.props
    let exchangeOptions = exchangeSymbols(used);
    return (
      <div className='column-two'>
        <div className='sel-ind'>
          <strong>Exchange</strong>
          <select ref='changeName' className='symbol-pick live-sym' value={this.state.exchange} onChange={this.exchangeChange.bind(this)}>
            <option key='NASDAQ-2' value='NASDAQ'>NASDAQ</option>
            <option key='NYSE-2' value='NYSE'>NYSE</option>
          </select>
        </div>
        <div className='sel-ind'>
          <strong>Symbol</strong>
          <select ref='feedSymbol' className='symbol-pick live-sym'>
            {exchangeOptions[this.state.exchange]}
          </select>
        </div>

        <div className='add-chart-butt-div text-center'>
          <div onClick={this.handleStart.bind(this)} className='cool-button add-chart-bt'>Something</div>
        </div>
      </div>
    )
  }
};
