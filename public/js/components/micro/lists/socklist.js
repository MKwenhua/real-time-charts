import React from "react";
import exchangeSymbs from 'data/gosymbols';

export default class StockList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exchange: 'NASDAQ'
    }
  };
  exchangeChange = (e) => this.setState({exchange: e.target.value});
  handleStart = () => {
    this.props.startChart(this.feedSymbol.value, "stocks")
  };
  render() {
    const used = this.props.used.length === 0 ? ["NOPE", "WHAT"] : this.props.used;
    const inUse = new RegExp("(" + used.join("|") + ")");
    const exchangeOpts = exchangeSymbs(inUse);
    return (
      <div className="column-two">
        <div className="sel-ind">
          <strong>Exchange</strong>
          <select ref={(select) => this.changeExchange = select} className="symbol-pick live-sym" defaultValue={this.state.exchange} onChange={this.exchangeChange}>
            <option key='NASDAQ-2' value="NASDAQ">NASDAQ</option>
            <option key='NYSE-2' value="NYSE">NYSE</option>
          </select>
        </div>
        <div className="sel-ind">
          <strong>Symbol</strong>
          <select ref={(select) => this.feedSymbol = select} className="symbol-pick live-sym">
            {exchangeOpts[this.state.exchange]}
          </select>
        </div>

        <div className="add-chart-butt-div text-center">
          <div onClick={this.handleStart} className="cool-button add-chart-bt">Something</div>
        </div>
      </div>
    )
  }
};
