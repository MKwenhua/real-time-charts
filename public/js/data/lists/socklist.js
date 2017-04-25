import React from "react";
const exchangeSymbs = require('data/gosymbols.js');

export default class StockList extends React.Component {
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
      this.props.startChart(this.refs.feedSymbol.value, "stocks")
   };
   render() {
      let used = this.props.used.length === 0 ? ["NOPE", "WHAT"] : this.props.used;
      let inUse = new RegExp("(" + used.join("|") + ")");
      let exchangeOpts = exchangeSymbs(inUse);
      return (
         <div className="column-two">
            <div className="sel-ind">
               <strong>Exchange</strong>
               <select ref="changeName" className="symbol-pick live-sym" value={this.state.exchange} onChange={this.exchangeChange.bind(this)}>
                  <option key='NASDAQ-2' value="NASDAQ">NASDAQ</option>
                  <option key='NYSE-2' value="NYSE">NYSE</option>
               </select>
            </div>
            <div className="sel-ind">
               <strong>Symbol</strong>
               <select ref="feedSymbol" className="symbol-pick live-sym">
                  {exchangeOpts[this.state.exchange]}
               </select>
            </div>

            <div className="add-chart-butt-div text-center">
               <div onClick={this.handleStart.bind(this)} className="cool-button add-chart-bt">Something</div>
            </div>
         </div>
      )
   }
};
