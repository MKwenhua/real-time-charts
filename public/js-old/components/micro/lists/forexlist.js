 const React = require('react');
/*
const forexSymbolPairs = ["AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/NZD", "AUD/USD", "BGN/RON", "CAD/CHF", "CAD/JPY",
 "CHF/BGN", "CHF/JPY", "CHF/RON", "CHF/TRY", "EUR/AUD", "EUR/CAD", "EUR/CHF", 
 "EUR/CZK", "EUR/DKK", "EUR/GBP", "EUR/HKD", "EUR/HUF", "EUR/ILS", "EUR/JPY", 
 "EUR/MXN", "EUR/NOK", "EUR/NZD", "EUR/PLN", "EUR/RON", "EUR/RUB", "EUR/SEK", 
 "EUR/SGD", "EUR/TRY", "EUR/USD", "EUR/ZAR", "GBP/AUD", "GBP/BGN", "GBP/CAD",
  "GBP/CHF", "GBP/CZK", "GBP/DKK", "GBP/HKD", "GBP/HUF", "GBP/JPY", "GBP/NOK", 
  "GBP/NZD", "GBP/PLN", "GBP/RON", "GBP/SEK", "GBP/SGD", "GBP/TRY", "GBP/USD", 
  "GBP/ZAR", "HKD/JPY", "NZD/CAD", "NZD/CHF", "NZD/JPY", "NZD/USD", "SGD/HKD", 
  "SGD/JPY", "TRY/BGN", "TRY/JPY", "TRY/RON", "USD/BGN", "USD/CAD", "USD/CHF",
   "USD/CZK", "USD/DKK", "USD/HKD", "USD/HUF", "USD/ILS", "USD/JPY", "USD/MXN", 
   "USD/NOK", "USD/PLN", "USD/RON", "USD/RUB", "USD/SEK", "USD/SGD", "USD/TRY", "USD/ZAR"];
   */
const forexSymbolPairs =  ["AUD/JPY","AUD/USD","CAD/CHF","CAD/JPY","CHF/JPY","EUR/AUD","EUR/CAD","EUR/GBP","EUR/JPY","EUR/NOK",
    "EUR/SEK","EUR/USD","GBP/CHF","GBP/JPY","GBP/USD","NZD/JPY", "NZD/USD","USD/BRL","USD/CAD","USD/CHF","USD/CNY",
    "USD/CZK","USD/HKD","USD/INR","USD/JPY","USD/KRW","USD/MXN","USD/NOK","USD/PLN","USD/RUB","USD/SEK","USD/SGD","USD/ZAR"];


export default class ForexList extends React.Component {
constructor(props) {
  	super(props);
  	this.state = {
  	    exchange: 'NASDAQ'
  	}
  	this.exchangeChange  = this.exchangeChange.bind(this);
  };
 exchangeChange (e) {
 		let ex =   e.target.value;
  	
  	this.setState({exchange: ex});
 	}
  handleStart () {
    this.props.startChart( 
      this.refs.feedSymbol.value, 
      "forex"
    )
  };

render() { 

  let used = this.props.used.length === 0 ? ["NOPE", "WHAT"] : this.props.used;
  let inUse = new RegExp("("+used.join("|")+")");
  const list = forexSymbolPairs.map((itm) => {
              if(inUse.test(itm)){
              return null;
              }else{
  						return <option key={itm} value={itm} >{itm}</option>;
              }
  					});
    return (  <div className="column-two text-center"> 
             <div className="sel-ind">
            <strong>Currency Pairs</strong>
            <select data-type="forex"
             ref="feedSymbol" 
            className="symbol-pick live-sym">
                {list}
              </select>
              </div>
                <div className="add-chart-butt-div text-center">
		          <div onClick={this.handleStart.bind(this)} className="cool-button add-chart-bt">Track</div>
		          </div>
            </div>)
	}
};