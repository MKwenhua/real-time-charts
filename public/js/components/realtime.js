const React = require('react');
import { connect } from "react-redux";
import LoadBars from './loaders/loadbars';
const CtxChart = require('./canvas/ctxChart.js');
const spreadCTX = require('./canvas/spreadCTX.js');
const CardCtx = require('./canvas/cardctx.js');
const Clock = require('./canvas/clock.js');
const PositionTiles = require('./canvas/positionTile.js');
const totalAmountCtx = require('./canvas/depositamt.js');
import DATASOURCE from "./data/datasource";
import OpenWebsocket from "./data/gowebsocket";
import CanvasChart from "./micro/canvaschart";
import LiveStart from "./micro/livestart";
import LoadConnect from "./loaders/spinload";
import ForexList from "./micro/lists/forexlist";
import StockList from "./micro/lists/socklist";
import ActiveSpreads from "./dashboard/partialview/activespreads";
import WidgetBlock from "./dashboard/widgetblock";
import SideOptions from "./dashboard/sideoptions";
import TransactionList from "./dashboard/transactionlist";
import LiveTickers from "./dashboard/livetickers";
import WatchedSpreads from "./dashboard/partialview/watchedspreads";

 
const chartClasses = (chartsLen) => {
  if(chartsLen === 0){
    return ["chart-box-100 col-sm-12", "chart-box-50 col-sm-12"];
  }
  if (chartsLen === 1){
    return ["chart-box-100 col-sm-12", "chart-box-50 col-sm-12"];
  }
  if (chartsLen === 2) {
    return  ["chart-box-50 col-sm-12", "chart-box-50 col-sm-12"];
  }
  if (chartsLen === 3) {
    return  ["chart-box-50 td-reduce col-sm-6", "chart-box-50 col-sm-12"];
  }
  if (chartsLen === 4) {
    return  ["chart-box-50 td-reduce col-sm-6","chart-box-50 td-reduce col-sm-6"];
  }

};
@connect((store) => {
  return {rt: store.rt,trades: store.trades, trn: store.transactions}
}) 
export default class RealTime extends React.Component {
    constructor(props) { 
      super(props)
      this.dbSource = OpenWebsocket();
      this.spreadRef = null;
      this.cardCtx = CardCtx();
     
      console.log('this.props in constructor', this.props);
      this.liveFeedStarted = this.liveFeedStarted.bind(this);
      this.optView = this.optView.bind(this);
      this.closeCrt = this.closeCrt.bind(this);
      this.wbClosed = this.wbClosed.bind(this);
      this.freshSet = this.freshSet.bind(this);
      this.setSpreadRef = this.setSpreadRef.bind(this);
      this.canvasPlaced = this.canvasPlaced.bind(this);
      this.switchIndices = this.switchIndices.bind(this);
      this.addNewChart = this.addNewChart.bind(this);
      this.resetCharts = this.resetCharts.bind(this);
      this.newPos = this.newPos.bind(this);
      this.tradeExpired = this.tradeExpired.bind(this);
      this.addChartMenu = this.addChartMenu.bind(this);
      this.depositChanged = this.depositChanged.bind(this);
      this.dbSource.on.liveFeedStarted = (details) => this.liveFeedStarted(details);
      this.dbSource.onclose = (event) => this.wbClosed(event);
      this.ulBlock = (indices, that) => {
        if (indices === "stocks") {
          return <StockList used={that.props.rt.seriesWatch} startChart={that.addNewChart.bind(that)} />;
        }
        if (indices === "forex") {
         return <ForexList used={that.props.rt.seriesWatch} startChart={that.addNewChart.bind(that)}/>;
        }
      }   
    }
    wbClosed (event) {
      console.log("Connection Closed");
      this.props.dispatch({
          type: "CONNECTION_LOST",
          payload: {connected: false}
      });
        
    }
    depositChanged (amt) {
      let {deposit} = this.props.trades;
      let newAmount = deposit - Math.round(amt);
      window.showDiff(deposit, newAmount);
      this.props.dispatch({
          type: "DEPOSIT_CHANGE",
          payload: newAmount
      });
        
    }
    addChartMenu() {
      this.props.dispatch({
          type: "TOGGLE_CHART_MENU",
          payload:   !this.props.rt.chartAddOpen 
      })
    }
    freshSet () {
      let lvStart = <LiveStart startChart={this.addNewChart.bind(this)} />;
      let cleanSlate =  {
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null,
        chartPositions: {},
        totalCharts: 0,
        newSet: lvStart,
        charts: {},
        chartClass: ["chart-box-100 col-sm-12", "chart-box-50 col-sm-12"],
        chartSlots: ['chart1', 'chart2', 'chart3', 'chart4'],
        seriesWatch: []};
      let stateSwitch = Object.assign({},this.props.rt, cleanSlate);
      this.props.dispatch({
          type: "CLOSE_CHART",
          payload: stateSwitch
      })
    }
    closeCrt (chrtSym) {
      let stateSwitch = Object.assign({},this.props.rt, {chart1: null, chart2:null, chart3: null, chart4: null});
      if (stateSwitch.totalCharts <= 1) {
        this.freshSet();
        return false;

      }
      let chartInd = {chart1: 0, chart2: 1, chart3: 2, chart4: 3 }
      let chartArr = ['chart1', 'chart2', 'chart3', 'chart4'];
      let series = this.props.rt.seriesWatch.filter((itm) => {
        return itm !== chrtSym;
      })
      let chartPositions = this.props.rt.seriesWatch.reduce((ob,itm) => {
         if(itm !== chrtSym){
          ob[itm] = this.props.rt.chartPositions[itm];
         }
         return ob;
      }, {});
      let cts = this.props.rt.charts; 
      let chartIndex = chartInd[cts[chrtSym].slot];

      let charts = Object.keys(cts).reduce((ob,itm) => {
        if (itm === chrtSym){
          return ob
        }else{
          if (chartInd[cts[itm].slot] > chartIndex ){
            let chartRef =  { slot: chartArr[chartInd[cts[itm].slot] - 1],
              symbol: cts[itm].symbol
            }
            ob[itm] = chartRef;
            stateSwitch[chartRef.slot] = this.props.rt[cts[itm].slot];
          }else{
            ob[itm] = cts[itm];
            stateSwitch[cts[itm].slot] = this.props.rt[cts[itm].slot];
          }
          return ob;
        }
      },{})
    
      let chartsLen = Object.keys(charts).length;
      stateSwitch['chartClass'] = chartClasses(chartsLen);
      stateSwitch['totalCharts'] = this.props.rt.totalCharts - 1;
      stateSwitch['seriesWatch'] = series;
      stateSwitch['platformView'] = "live graphs";
      stateSwitch['chartPositions'] = chartPositions;
      stateSwitch['chartSlots'] = chartArr.slice(chartsLen);
      stateSwitch['charts'] = charts;

     this.props.dispatch({
          type: "CLOSE_CHART",
          payload: stateSwitch
      }) 


    } 
    switchIndices(e) {
      if (e.target.classList.contains('selected-li')) return 'yo';

      let ulType = e.target.dataset.key;
 
      if (ulType === "stocks") {
        this.props.dispatch({
          type: "SWITCH_INDICES",
          payload: "stocks"
        });
      }
      if (ulType === "forex") {
        this.props.dispatch({
          type: "SWITCH_INDICES",
          payload: "forex"
        });
      }

    }
    setSpreadRef (spreadCntrl) {
     this.spreadRef = spreadCntrl;
    }
    
    optView (type) {
      let  currentClass =  "half-view";
      let dashview = this.props.rt.platformView;
      switch (type) {
        case "spreads":
          this.spreadRef.setting(type);
          currentClass = this.props.rt.tradViewClass === "full-view" ? "half-view" : "full-view";
          currentClass === "half-view" ? this.spreadRef.inView() : this.spreadRef.outView();
          PositionTiles.outView();
          break;
        case "current-bids": 
          currentClass = this.props.rt.tradViewClass === "full-view" ? "half-view" : "full-view";
          currentClass === "half-view" ?  PositionTiles.inView() : PositionTiles.outView();
          this.spreadRef.outView();
          break;
        case "past-pos": 
          dashview = "trade list";
          currentClass = "full-view";
          CtxChart.outOfView();
          Clock.outView();
          this.cardCtx.outView();
          this.spreadRef.outView(); 
          break;
        case "charts": 
          currentClass =  "full-view";
          this.spreadRef.outView(); 
          this.cardCtx.outView();
          Clock.inView();
          PositionTiles.outView();
          CtxChart.backInView();
          dashview = "live graphs";
          break;
        case "live options":{
          dashview = "live options";
          currentClass = "full-view";
          CtxChart.outOfView();
          Clock.outView();
          PositionTiles.outView();
          this.cardCtx.inView();
          this.spreadRef.outView(); 
          break;
        }
        case  "overview":
          dashview = "trade history";
          currentClass = "full-view";
          CtxChart.outOfView();
          Clock.outView();
          PositionTiles.outView();
          this.cardCtx.outView();
          this.spreadRef.outView(); 
          break;

      }
       this.props.dispatch({
          type: "OPTS_VIEW",
          payload: {
            tradViewClass: currentClass, 
            optsComponent: type,
            platformView: dashview
        }
      });
    
    }
    liveFeedStarted(symbFeed) {
      let seriesWatch = this.props.rt.seriesWatch;
      seriesWatch.push(symbFeed);
      this.props.dispatch({
          type: "FEED_START",
          payload: {
        seriesWatch: seriesWatch,
        addButton: true
      }
      })
  
    }
    addNewChart(symb, index) {
      let charts = this.props.rt.charts;
      let chartSlots = this.props.rt.chartSlots;
      let slot = chartSlots.shift();
      charts[symb] = {
        slot: slot,
        symbol: symb
      };
      let chartsLen = Object.keys(charts).length;
      let chartClass = this.props.rt.chartClass;
      if (chartsLen === 2) {
        chartClass[0] = "chart-box-50 col-sm-12";
      }
      if (chartsLen === 3) {
        chartClass[0] = "chart-box-50 td-reduce col-sm-6";
      }
      if (chartsLen === 4) {
        chartClass[1] = "chart-box-50 td-reduce col-sm-6";
      }
      let stateOB = Object.assign({},this.props.rt);
   
      if(this.props.rt.totalCharts === 0){
      stateOB['onStart'] = false;
      }
      stateOB.chartPositions[symb] = {trades: [], position: {}, total: 0.0, current: null}
      stateOB['charts'] = charts;
      stateOB['chartSlots'] = chartSlots;
      stateOB['chartClass'] = chartClass;
      stateOB['addButton'] = true;
      stateOB['newSet'] = null;
      stateOB['chartAddOpen'] = false;
  
      stateOB['totalCharts'] = this.props.rt.totalCharts + 1;
      let keyy = symb + '_key';
      stateOB[slot] = <CanvasChart key={keyy} newPos={this.newPos.bind(this)} depChg={this.depositChanged.bind(this)}  ctx={CtxChart.passCTXconstructor()} clock={Clock} positions={stateOB.chartPositions[symb]} clCtx={this.closeCrt.bind(this)} dataSource={this.dbSource} mainSym={symb} whenMounted={this.canvasPlaced.bind(this)} />;
      
      this.props.dispatch({
          type: "ADD_CHART",
          payload: stateOB
        })
    }

    
    canvasPlaced() {
      //this.ctxChart =  CtxChart();
 
    };
    tradeExpired (pos) {
      let {pastTrades, deposit, currentPos, todayTotalNet} = this.props.trades;
      let currentPoint =   pos.getLatestPoint();
      let diff = (currentPoint.data[3] - pos.unitPrice) * pos.qty;
      let newNet = todayTotalNet + diff;
      let newAmount = Math.round(deposit + (currentPoint.data[3] * pos.qty ));
      let pastTradeCopy = [{
          position: pos.symb,
          volume: pos.qty,
          date: new Date().toDateString(),
          short: pos.type === "PUT",
          pricestart: (Math.round(pos.unitPrice * 100) / 100), 
          priceend: (Math.round(currentPoint.data[3] * 100) / 100),
          profit: diff
      }].concat(pastTrades);
      window.showDiff(deposit, newAmount);
      this.props.dispatch({
          type: "TRADE_COMPLETE",
          payload: {
            deposit: newAmount,
            currentPos: currentPos.filter((itm) => itm.ctxid !== pos.ctxid ),
            pastTrades: pastTradeCopy,
            todayTotalNet: newNet
          }
      });

    }
    newPos (pos) {
      let {deposit, currentPos} = this.props.trades;
      let newCurrentPos = [pos].concat(currentPos);
      let newAmount = deposit - Math.round(pos.unitPrice * pos.qty);
      window.showDiff(deposit, newAmount);
      this.props.dispatch({
        type:"ADD_TRADE",
        payload:{currentPos: newCurrentPos, deposit: newAmount}
      });

      (function(pos){
        let thisScope = this;
        let timeOut = 60000 * pos.time;
        setTimeout(function(){
          thisScope.tradeExpired(pos);
         }, timeOut);
      }).call(this, pos);

    }
    canvasOut() {
      this.ctxChart.shutdown();
    }

    componentDidMount() {
     let self = this;
      console.log('this.props', this.props);
      this.dbSource.onopen = function (event) {
       self.props.dispatch({
          type: "CONNECTED",
          payload: true
        });
      };
    
      window.addEventListener("online", function(e){  
        self.props.dispatch({
          type: "CONNECTED",
          payload:  true
        });
      }, false);
      window.addEventListener("offline", function(e){
        self.props.dispatch({
          type: "CONNECTION_LOST",
          payload:  false
        });
      }, false);
      totalAmountCtx(this.props.trades.deposit);
        console.log('real-time-props', this.props);
        if (this.props.rt.totalCharts) {
          this.resetCharts();
        }
    }
    resetCharts () { 
      let { seriesWatch, chartPositions, charts } = this.props.rt;
      let stateOB = Object.assign({},this.props.rt);
     Object.keys(charts).forEach((symb, i) => {
        let slot = stateOB.charts[symb];
        let keyy = symb + '_key';
        stateOB[slot] = <CanvasChart key={keyy} depChg={this.depositChanged.bind(this)}  ctx={CtxChart.passCTXconstructor()} clock={Clock} positions={chartPositions[symb]} clCtx={this.closeCrt.bind(this)} dataSource={this.dbSource} mainSym={symb} whenMounted={this.canvasPlaced.bind(this)} />;
      });
       this.props.dispatch({
          type: "RESET_CHARTS",
          payload: stateOB
        })
    }
    componentWillMount() {
    if(this.dbSource.readyState === "OPEN"){
      this.props.dispatch({
          type: "CONNECTED",
          payload: true
        });

     }  
     
    }
    componentWillUnmount() {
     // this.dbSource.close();
    }
  
  render() {
    let {optsComponent,onStart, platformView, tradViewClass, chart1, chart2, chart3, chart4 , chartClass}  = this.props.rt;
    let tdClass = tradViewClass === "half-view";
    const onlineStatus = this.props.rt.connected ? "Connected" : "Not Connected";
    let blockStart = onStart ? <LiveStart startChart={this.addNewChart.bind(this)} /> : null;
    let blocked = this.props.rt.connected ? blockStart : <LoadConnect />;
    return (<div>
            <div id="rtTopNavUI">
              <div className="fake-logo">
                <span>
                <i className="material-icons">language</i>
                </span>
                <span className="span-two">
                  Trade Stuff
                </span>
              </div>
              <div className={this.props.rt.addButton ? "add-chart" : "add-chart no-see-no-click"} onClick={this.addChartMenu.bind(this)}>
              <i className="material-icons">add</i>
               </div>
               <div id="chartAdOptions" className={this.props.rt.chartAddOpen ? "" : "hide-elm"}>
                   <div className={this.props.rt.totalCharts >= 4 ? "add-chart-warn" : "hide-elm"}>
                    <h3>You can only have 4 charts at a time, sorry!</h3>
                  </div>
                    <div className={this.props.rt.totalCharts < 4 ? "add-chart-cnt" : "hide-elm"}>
                  <div className="column-two type-nav">
                     <strong>Market</strong>
                    <ul onClick={this.switchIndices.bind(this)}>
                    <li key={"stocks"} data-key="stocks" className={this.props.rt.selectUl === "stocks" ?  "selected-li" : ""}>Stocks</li>
                    <li key={"forex"} data-key="forex" className={this.props.rt.selectUl === "forex" ? "selected-li" : ""}>Forex</li>
                    </ul>
                  </div>
                  {this.ulBlock(this.props.rt.selectUl, this)}
                  </div>
                  
                 
               </div>
                 <div id="connectedState">
                  <div className={this.props.rt.connected ? "online-state online" : "online-state offline"}></div>
                  <span>{onlineStatus}</span>
                 </div>
            </div>
            <div id="scorePoints" className={(platformView !== "trade history"  && !onStart ) ? "" : "hide-elm"}>
                    
                        <span className="count span-green total-earnings"><canvas id="totalAccount" height={40} width={100}></canvas></span>
                        <span className="deposit-span">DEPOSIT</span>
                      
                    </div>
            <section id="realTimeTheme">
             
                {blocked}
                
             <SideOptions platformView={platformView} optsComponent={optsComponent} tdClass={tdClass} onStart={this.props.rt.onStart} itmView={this.optView.bind(this)} />
             
              <section id="optionsView"  className={this.props.rt.onStart ? "hide-elm"  : "ok"}>
                <div className={optsComponent === "spreads" ? "in-view-opts" : "hide-elm"}>
                   <ActiveSpreads setSpreadRef={this.setSpreadRef.bind(this)}  callCT={spreadCTX} dataSource={this.dbSource} />
                </div>
                 <div className={optsComponent === "current-bids" ? "in-view-opts" : "hide-elm"}>
                 <WatchedSpreads PositionTiles={PositionTiles} activePosList={this.props.trades.currentPos} />
                </div>     
              </section>  
              <section id="tradingplatform" className={this.props.rt.onStart ? "hide-elm"  :  tradViewClass}>
                 <div className={platformView === "live graphs" ? "wrap-block" : "hide-elm"}>
                   {this.props.rt.newSet}

               
                  <div className={chart1 ? chartClass[0] : "hide-elm"}>
                     {chart1}
                  </div>
                  <div className={chart2 ? chartClass[0] : "hide-elm"}>
                    {chart2}
                  </div>
                  <div className={chart3 ? chartClass[1] : "hide-elm"}>
                    {chart3}
                  </div>
                 <div className={chart4 ? chartClass[1] : "hide-elm"}>
                     {chart4}
                 </div>
                </div>
                <div id="dashView" className={platformView === "trade history" ? "wrap-block" : "hide-elm"}>
                 <WidgetBlock inView={platformView === "trade history"} />
                </div>
                 <div  className={platformView === "trade list" ? "wrap-block history-list" : "hide-elm"}>
                  <TransactionList inView={platformView === "trade list"} pastTrades={this.props.trades.pastTrades} />
                </div>
                 <div  className={platformView === "live options" ? "wrap-block history-list" : "hide-elm"}>
                  <LiveTickers cardCtx={this.cardCtx} inView={platformView === "live options"}  />
                </div>
             </section>
            </section>
            </div>
            )
  
  }
};