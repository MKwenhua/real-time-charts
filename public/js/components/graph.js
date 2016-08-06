const React = require('react');
const ReactDOM = require('react-dom');
import LoadBars from './loaders/loadbars';
import SymbolTag from './micro/symbolTag';
import ChartTypeSpan from './micro/chartTypeSpan';
const ReactHighstock = require('./react-highcharts/dist/ReactHighstock.src.js');
import DATASOURCE from "./data/datasource";
const graphConfigs = require("./graphs/graphconfigs.js");
const dataFormat = require("./graphs/data_transform.js");
const exchangeOpts = require('./data/symbols.js');


const metricDefaults = {
	OHLC: 'candlestick',
	PRICE: 'line',
	VOLUME: 'column'
}
const filterDublicates = (main,symb, arr) => {
	if (arr.length === 0) return [symb];
  let sA = main === symb ? [symb] : [main, symb];
	return arr.reduce((ob,sm, i) => {
		  if (i >= 5) return ob;

			if (sm !== symb && sm !== main){
				ob.push(sm);
			}
				return ob;
			}, sA );
};


export default class Graph extends React.Component {
	constructor(props) {
  super(props);
	  this.dbSource = DATASOURCE;
	  this.state = {
	  	blocked: <LoadBars />,
	  	symbol: 'AAPL',
	  	exchange: 'NASDAQ',
	  	addSymb: false,
	  	exchangeAd: 'NASDAQ',
	  	metric: 'OHLC',
	  	activeSymbols: [],
	  	sets: {},
	  	dataset: null,
	  	graphType: 'candlestick'
	  };
	  this.gotData = this.gotData.bind(this);
	  this.gotDataM = this.gotDataM.bind(this);
	  this.toggleAddSymb = this.toggleAddSymb.bind(this);
	  this.getDataCall = this.getDataCall.bind(this);
	  this.graphType = this.graphType.bind(this);
	  this.reDraw    = this.reDraw.bind(this);
	  this.reDrawM   = this.reDrawM.bind(this);
	  this.symbolAdd = this.symbolAdd.bind(this);
	  this.getDataCallMulti = this.getDataCallMulti.bind(this);
	  this.metricChange = this.metricChange.bind(this);
	  this.exchangeChange = this.exchangeChange.bind(this);
	  this.exchangeChangeAdd = this.exchangeChangeAdd.bind(this);
	  this.symbolChange = this.symbolChange.bind(this);
	 	this.dbSource.socket.on('marketData',  (details) => this.gotData( details )); 
	 	this.dbSource.socket.on('dataLookup',  (details) => this.gotDataM( details )); 
 	}
 	reDraw (gType, metric) {
 		let met = metric ? metric : this.state.metric;
 		let mkData = this.state.sets[this.state.symbol];
 		let dataTransform = dataFormat[gType]()
		let stats = mkData.data.map((dta) => {
			return	dataTransform(dta);
		});
		let config = graphConfigs[gType]( mkData.sym, stats);
	  
		this.setState({
			blocked: <ReactHighstock config={config} /> , 
		 	graphType: gType,
		 	metric: met
		 });
 	}
 	reDrawM (gType, met) {
 		if(this.state.metric !== 'PRICE' && met !== 'PRICE') {
 			let met = met ? met : this.state.metric;
 			this.reDraw(gType, met);
 		}else{
 			let seriesOpts = this.state.activeSymbols.map((dta) => {
			   let lineData = this.state.sets[dta].data.map((itm) => { 
			   		return [new Date(itm.timestamp).getTime(), itm.close];
			   });  
				return	gType === 'step' ? {name: dta , step:true, data:  lineData } :  {name: dta , type: gType , data:  lineData };
			});
			let config = graphConfigs.multiconfig(this.state.symbol, seriesOpts);
			this.setState({
				blocked: <ReactHighstock config={config} /> , 
			 	graphType: gType,
			 	metric: 'PRICE'
			});
 		}
 	}
 	toggleAddSymb () {
 		let toggle = this.state.addSymb;
 		this.setState({addSymb: !toggle});
 	}
 	graphType (e) {
 		if (e.target.className === "set-at") return '';

 		let gType = e.target.dataset.tp;
 		if (!gType) return '';


      this.state.activeSymbols.length === 1 ? this.reDraw(gType) : this.reDrawM(gType);
 	
 	}
 	getDataCall (symb) {
 		if (this.dbSource.connected) {
  		this.dbSource.getMarketDataSockets(symb);
  	} else {
  		this.dbSource.getMarketDataXHR(symb, this.gotData);
  	}
 	}
 	getDataCallMulti (symb) {
 		if (this.dbSource.connected) {
  		this.dbSource.getMarketDataMultiSockets(symb);
  	} else {
  		this.dbSource.getMarketDataXHR(symb, this.gotDataM);
  	}
 	}
  componentDidMount () {
  	this.getDataCall(this.state.symbol);
  }
  exchangeChangeAdd (e) {
  	let ex =   e.target.value;
  	
  	this.setState({exchangeAd: ex});

  }
  exchangeChange (e) {
  	let ex =   e.target.value;
  	
  	this.setState({exchange: ex, exchangeAd:ex});

  }
  symbolChange (e) {
  	let symb = e.target.value;
  	if(this.state.sets[symb]){
  		  let active = filterDublicates(symb,this.state.symbol,this.state.activeSymbols );
  			this.setState({symbol: symb,activeSymbols: active});
  			this.getDataCall(symb);
  	}else{
  		this.setState({symbol: symb});
  			this.getDataCall(symb);
  	}
  
  }
  symbolAdd () {
  	let symb = this.refs.addSymbol.value;
  	if (!this.state.sets[symb]) {
  		let activez = this.state.activeSymbols;
	  	let active = filterDublicates(this.state.symbol,symb,activez.slice(0, 6) );
	  
	  	
	  	this.setState({activeSymbols: active, addSymb: false});
	  	this.getDataCallMulti(symb);
	  }
  }
  metricChange (e) {
  	let met = e.target.value;
  	if(met !== this.state.metric){
  		if(met === 'PRICE') {
     		this.state.activeSymbols.length === 1 ? this.reDraw( metricDefaults[met], met) : this.reDrawM( metricDefaults[met], met);
     	}else{
     		this.reDraw( metricDefaults[met], met);
     	}
    }

  }
	gotData (details) { 
		console.log('got data', details);
		let graphType = this.state.graphType;
		let dataTransform = dataFormat[graphType]()
		let data = details.results.map((dta) => {
			return	dataTransform(dta);
		});
		let config = graphConfigs[graphType]( details.results[0].symbol, data);
		let last =  details.results[details.results.length - 1];
		let sets =  this.state.sets;
		let newSymb = details.results[0].symbol;
		let newActive = filterDublicates(this.state.symbol,newSymb,this.state.activeSymbols.slice(0, 6) );
		sets[newSymb] = {sym: newSymb, data:  details.results , isUp: last.open < last.close, num: last.close, open:last.open };
		let setsCopy = newActive.reduce((oo, itm) => {
			oo[itm] = sets[itm];
			return oo;
		},{});
		this.setState({
			blocked: <ReactHighstock config={config} /> , 
		 	activeSymbols: newActive,
		 	sets: setsCopy
		  });
	}
	gotDataM (details) { 
		console.log('got data', details);
	  let last =  details.results[details.results.length - 1];
    let sets =  this.state.sets;
    let newSymb = details.results[0].symbol;
    sets[newSymb] = {sym: newSymb, data:  details.results , isUp: last.open < last.close, num: last.close, open:last.open };
    let activeSyms =  filterDublicates(this.state.symbol,newSymb,this.state.activeSymbols.slice(0, 6) );
		let seriesOpts = activeSyms.map((dta) => {
			   let lineData = sets[dta].data.map((itm) => { 
			   		return [new Date(itm.timestamp).getTime(), itm.close];
			   });
			return	{name: dta , data:  lineData };
		});
		let config = graphConfigs.multiconfig(this.state.symbol, seriesOpts);
		let setsCopy = activeSyms.reduce((oo, itm) => {
				oo[itm] = sets[itm];
				return oo;
		},{});
		this.setState({
			blocked: <ReactHighstock config={config} /> , 
		 	metric: 'PRICE',
		 	activeSymbols: activeSyms,
		 	graphType: 'line',
		 	sets: setsCopy
		});
	}
render() {
	  let setsOb = this.state.sets;
		const activeSets = this.state.activeSymbols.map((symb) => {  
						return <SymbolTag key={symb + '_tag_w'} sm={setsOb[symb]} />;
		});
		const cShow = this.state.metric === 'OHLC' || this.state.metric === 'PRICE';
		const spans = <ChartTypeSpan gType={this.state.graphType} metric={this.state.metric} />;

		
    return (<div className="container">
            <div className="chart-controller">
            <div className="select-holders">
            <strong>Symbols:</strong>
						 <select ref="exSymbol"
						         className="symbol-pick"
						         value={this.state.symbol}
						         onChange={this.symbolChange.bind(this)} >
						  {exchangeOpts[this.state.exchange]}
						 </select>
            </div>
            <div className="select-holders">
            <strong>Exchange:</strong>
						<select ref="changeName"
						         className="symbol-pick"
						         value={this.state.exchange}
						         onChange={this.exchangeChange.bind(this)} >
							<option key='NASDAQ' value="NASDAQ">NASDAQ</option>
							<option key='NYSE' value="NYSE">NYSE</option>
						</select>
            </div>

            </div>
            <div id="chartConfig">
            <ul className="inline-ul"><li>
            	<span className="label">Metric:</span>
            	<select ref="chartType"
						         className="chart-pick"
						         value={this.state.metric}
						         onChange={this.metricChange.bind(this)} >
								<option key={'OHLC'} value="OHLC" >OHLC</option>
								<option key={'PRICE'} value="PRICE" >Stock Price</option>
								<option key={'VOLUME'} value="VOLUME" >Volume</option>
							</select>
            </li>
            <li className="compare" onClick={this.toggleAddSymb.bind(this)}>
	            <i className="material-icons">&#xE145;</i>
	            <span>Compare</span>
            </li>
            <li className="hide-elm">
	            <i className="material-icons">&#xE8B8;</i>
	            <span>Settings</span>
	           
            </li>
            </ul>
            </div>
            <div id="add-symbol" className={this.state.addSymb ? "open" : "close"}>
            	<span className="span-label">symbol:</span>
            		<select ref="addSymbol"
						         className="add-in">
						       
						  		{exchangeOpts[this.state.exchangeAd]}
						 	</select>
						 	<span className="span-label">exchange:</span>
						 	 <select ref="changeEXAd"
						         className="add-in"
						         value={this.state.exchange}
						         onChange={this.exchangeChangeAdd.bind(this)} >
								<option key='NASDAQ-add' value="NASDAQ">NASDAQ</option>
								<option key='NYSE-add' value="NYSE">NYSE</option>
							</select>
							<span className="add-symbol-submit" onClick={this.symbolAdd.bind(this)}>
								ADD
							</span>
            </div>
            <div onClick={this.graphType.bind(this)} className={cShow ? "chart-controller chart-set" : "chart-controller chart-set hide-elm" } >
            
             {spans}
            </div>	
               <ul id="activeCharts" className="activeCharts">
            {activeSets}
            </ul>
           		{this.state.blocked}
            </div>
            )
	}
};