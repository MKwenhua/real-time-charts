import React from "react";
import forexSymbolPairs from 'data/forex_symbol_pairs';

export default class ForexList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exchange: 'NASDAQ'
    }
  };
  exchangeChange = (e) => this.setState({exchange: e.target.value});
  handleStart = () => {
    this.props.startChart(this.feedSymbol.value, "forex")
  };

  render() {
    const used = this.props.used.length === 0 ? ["NOPE", "WHAT"] : this.props.used;
    const inUse = new RegExp("(" + used.join("|") + ")");
    const list = forexSymbolPairs.map((itm) => {
      if (inUse.test(itm)) {
        return null;
      } else {
        return <option key={itm} value={itm}>{itm}</option>;
      }
    });
    return (
      <div className="column-two text-center">
        <div className="sel-ind">
          <strong>Currency Pairs</strong>
          <select data-type="forex" ref={(select) => this.feedSymbol = select} className="symbol-pick live-sym">
            {list}
          </select>
        </div>
        <div className="add-chart-butt-div text-center">
          <div onClick={this.handleStart} className="cool-button add-chart-bt">Track</div>
        </div>
      </div>
    )
  }
};
