const React = require('react');
const CtxChart = require('../canvas/ctxChart.js');
import CallPut from './buysell';
const chartOpts = (type) => {
	switch(type) {
	case "candlestick":
	  return <span data-tp="candlestick">Candlestick<img data-tp="candlestick" height="18" src="/icons/candlestick.png" /></span>;
	  break;
	case "ohlc":
	  return <span data-tp="ohlc" >OHLC<img data-tp="ohlc" height="18" src="/icons/ohlc.png" /></span>;
	  break;
	case "area":
	  return <span data-tp="area">Area<img data-tp="area" height="18" src="/icons/area.png" /></span>;
	  break;
	case "line":
	  return <span data-tp="line">Line<img  data-tp="line" height="18" src="/icons/line.png" /></span>;
	  break;
	default:
	  return <span data-tp="area">Area<img data-tp="area" height="18" src="/icons/area.png" /></span>;
	}	
}
export default class CanvasChart extends React.Component {
 constructor (props) {
  super(props);
	  this.dbSource = this.props.dataSource;
	  this.dataPoints = [];
	  
	  this.feedWatch = this.props.mainSym; 
	  this.ctxChart = null;
	  this.state = {
	  	    modalOpen: false,
	 		dataLength: 500,
	 		onStart: true,
	 		optsOpen:  false, 
	 		chartType: "candlestick",
	 		mainSymbol: this.props.mainSym,
	 		seriesWatch: []
	  };
	  this.liveUpdate = this.liveUpdate.bind(this);
	  this.hideUL = this.hideUL.bind(this);
	  this.toggleSets = this.toggleSets.bind(this);
	  this.closeChart = this.closeChart.bind(this);
	  this.toggleModal = this.toggleModal.bind(this);
	  this.chartTypeSel = this.chartTypeSel.bind(this);
	  this.dbSource.dispatchEvent(this.feedWatch,  (details) => this.liveUpdate( details )); 
	}
 toggleModal (bool) {
 	this.setState({
 		modalOpen: bool
 	});
 }
 closeChart () {
   let feedExit = "exit_" + this.props.mainSym;
   this.dbSource.send(feedExit);
   this.props.clCtx(
   	this.props.mainSym
   	)
 }
 toggleSets (bool) {
 	this.setState({optsOpen: bool});
 }
 hideUL () {
 	this.setState({optsOpen: false});
 }
 chartTypeSel (e) {
 	if (e.target.className === "selected-chart" || e.target.parentElement.className === "selected-chart" ) {
 		return '';
 	}

 	let chartType = e.target.dataset.tp;
 	if (chartType) {
 		this.setState({chartType: chartType, optsOpen: false});
 	  
 		this.ctxChart.chartType(chartType);
 	}
 }
 componentDidMount () {
    this.props.whenMounted();
    this.ctxChart = CtxChart(this.props.mainSym);
    this.dbSource.send( this.props.mainSym);
 }
 componentWillUnmount () {
   //removeSeries
 }
 liveUpdate (data) {
		this.ctxChart.dataStream(data);
	}

render() {
   const chartTypeLis = ['candlestick','area', 'ohlc','line' ].map((itm, ii) => {
   	  let clName = this.state.chartType === itm ? "selected-chart" : "";
     return <li key={"get-" + itm}  data-tp={itm} className={clName}>	{chartOpts(itm)} </li>;
    });
    return ( <div className="real-time-chart">
    			   <div className="chart-switch">
	    			<div className="seclect-chart-butt"  >
	    			<div onClick={this.toggleSets.bind(this, true)}
	    			className={ this.state.optsOpen ? "hide-elm" : "current-type"}>
	    			<span>{this.state.chartType}</span><span><i className="material-icons small-i">arrow_drop_down</i></span>
	    			</div>
	    			<ul className={ this.state.optsOpen ? "chart-select-ul" : "hide-elm"} onMouseLeave={this.hideUL.bind(this)} onClick={this.chartTypeSel.bind(this)}>
	    				{chartTypeLis}
	    			</ul>
	    			</div>
	    			<div onClick={this.toggleModal.bind(this, true)} className="chart-remove"><span>Close</span><i className="material-icons">clear</i></div>
    			</div>
          		<div id={this.props.mainSym}  className="chartContainer">
          		</div>
          
					<CallPut />
				<div className={this.state.modalOpen ? "warn-modal fade-in" : "hide-elm"}>
                	<div className="heading-block">
                	<i className="material-icons">warning</i>
                		<span>FYI</span>
                		<p>Closing this modal will close your Feed listener for <b>{this.props.mainSym}</b></p>
                		<div onClick={this.closeChart.bind(this)} className="cool-button agree-ok">I know</div>
                		<div  onClick={this.toggleModal.bind(this, false)} className="cool-button disagree-ok">Nevermind</div>
                	</div>
				</div>
            </div>
            )
	}
};