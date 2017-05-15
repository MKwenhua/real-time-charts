import React from "react";
import exchangeOptions from 'pure_functions/lists/stocks';

export default class LiveStart extends React.Component {
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
      this.props.startChart(this.refs.feedSymbol.value)
   };
   render() {

      return (
         <div className="container">
            <div className="chart-controller chart-live-cntrl live-set">
               <div className="select-holders spread-m">
                  <strong>Symbols:</strong>
                  <select ref="feedSymbol" className="symbol-pick live-sym">
                     {exchangeOptions[this.state.exchange]}
                  </select>
               </div>
               <div className="select-holders spread-m">
                  <strong>Exchange:</strong>
                  <select ref="changeName" className="symbol-pick live-sym" value={this.state.exchange} onChange={this.exchangeChange.bind(this)}>
                     <option key='NASDAQ-2' value="NASDAQ">NASDAQ</option>
                     <option key='NYSE-2' value="NYSE">NYSE</option>
                  </select>
               </div>
            </div>
            <div className="row text-center">
               <div onClick={this.handleStart.bind(this)} className="big-butt cool-button">Start LiveFeed!</div>
            </div>
         </div>
      )
   }
};
