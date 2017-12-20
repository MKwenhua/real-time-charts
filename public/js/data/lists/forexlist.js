import React from "react";

const forexSymbolPairs = [
   "AUD/JPY",
   "AUD/USD",
   "CAD/CHF",
   "CAD/JPY",
   "CHF/JPY",
   "EUR/AUD",
   "EUR/CAD",
   "EUR/GBP",
   "EUR/JPY",
   "EUR/NOK",
   "EUR/SEK",
   "EUR/USD",
   "GBP/CHF",
   "GBP/JPY",
   "GBP/USD",
   "NZD/JPY",
   "NZD/USD",
   "USD/BRL",
   "USD/CAD",
   "USD/CHF",
   "USD/CNY",
   "USD/CZK",
   "USD/HKD",
   "USD/INR",
   "USD/JPY",
   "USD/KRW",
   "USD/MXN",
   "USD/NOK",
   "USD/PLN",
   "USD/RUB",
   "USD/SEK",
   "USD/SGD",
   "USD/ZAR"
];

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
