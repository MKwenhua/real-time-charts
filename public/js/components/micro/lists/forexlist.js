import React from "react";
import forexSymbolPairs from 'data/forex_symbol_pairs';

export default class ForexList extends React.Component {
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
      this.props.startChart(this.refs.feedSymbol.value, "forex")
   };

   render() {

      let used = this.props.used.length === 0 ? ["NOPE", "WHAT"] : this.props.used;
      let inUse = new RegExp("(" + used.join("|") + ")");
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
               <select data-type="forex" ref="feedSymbol" className="symbol-pick live-sym">
                  {list}
               </select>
            </div>
            <div className="add-chart-butt-div text-center">
               <div onClick={this.handleStart.bind(this)} className="cool-button add-chart-bt">Track</div>
            </div>
         </div>
      )
   }
};
