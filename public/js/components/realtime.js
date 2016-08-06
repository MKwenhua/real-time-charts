const React = require('react');
const ReactDOM = require('react-dom');
import LoadBars from './loaders/loadbars';
const ctxChart = require('./canvas/ctxChart.js');
const spreadCTX = require('./canvas/spreadCTX.js');
import DATASOURCE from "./data/datasource";
import OpenWebsocket from "./data/gowebsocket";
import CanvasChart from "./micro/canvaschart";
import LiveStart from "./micro/livestart";
import LoadConnect from "./loaders/spinload";
import ForexList from "./micro/lists/forexlist";
import StockList from "./micro/lists/socklist";
import ActiveSpreads from "./micro/activespreads";
import WidgetBlock from "./widgets/widgetblock";

const chartClasses = (chartsLen) => {
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
export default class RealTime extends React.Component {
    constructor(props) { 
      super(props);
      this.dbSource = OpenWebsocket();
      this.spreadRef = null;
      this.state = {
        dataLength: 500,
        onStart: true,
        chart1: null,
        chart2: null,
        chart3: null,
        chart4: null,
        chartAddOpen: false,
        selectUl: "forex",
        totalCharts: 0,
        addButton: false,
        optsComponent: null,
        platformView: "live graphs",
        tradViewClass: "full-view",
        ulBlocked: <ForexList used={[]} startChart={this.addNewChart.bind(this)}/>,
        chartClass: ["chart-box-100 col-sm-12", "chart-box-50 col-sm-12"],
        chartSlots: ['chart1', 'chart2', 'chart3', 'chart4'],
        connected: this.dbSource.readyState === "OPEN",
        blocked:  <LiveStart startChart={this.addNewChart.bind(this)} />,
        charts: {},
        seriesWatch: []
      };


      this.liveFeedStarted = this.liveFeedStarted.bind(this);
      this.startLiveFeed = this.startLiveFeed.bind(this);
      this.optView = this.optView.bind(this);
      this.updateSelect = this.updateSelect.bind(this);
      this.closeCrt = this.closeCrt.bind(this);
      this.wbClosed = this.wbClosed.bind(this);
     this.setSpreadRef = this.setSpreadRef.bind(this);
      this.canvasPlaced = this.canvasPlaced.bind(this);
      this.switchIndices = this.switchIndices.bind(this);
      this.addNewChart = this.addNewChart.bind(this);
      this.addChartMenu = this.addChartMenu.bind(this);
      this.dbSource.on.liveFeedStarted = (details) => this.liveFeedStarted(details);
      this.dbSource.onclose = (event) => this.wbClosed(event);
         
    }
    wbClosed (event) {
      console.log("Connection Closed");
      this.setState({connected: false});
        
    }
    addChartMenu() {
      this.setState({
        chartAddOpen: !this.state.chartAddOpen
      });
    }
    closeCrt (chrtSym) {
      //let chartLst =  this.state.chartSlots;
      let stateSwitch = {chart1: null, chart2:null, chart3: null, chart4: null};
      let chartInd = {chart1: 0, chart2: 1, chart3: 2, chart4: 3 }
      let chartArr = ['chart1', 'chart2', 'chart3', 'chart4'];
      //chartLst.push(chrtKey)
      let series = this.state.seriesWatch.filter((itm) => {
        return itm !== chrtSym;
      })
      let cts = this.state.charts; 
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
            stateSwitch[chartRef.slot] = this.state[cts[itm].slot];
          }else{
            ob[itm] = cts[itm];
            stateSwitch[cts[itm].slot] = this.state[cts[itm].slot];
          }
          return ob;
        }
      },{})
    
      let chartsLen = Object.keys(charts).length;
      stateSwitch['chartClass'] = chartClasses(chartsLen);
      stateSwitch['ulBlocked'] = this.updateSelect(series);
      stateSwitch['totalCharts'] = this.state.totalCharts - 1;
      stateSwitch['seriesWatch'] = series;
      stateSwitch['chartSlots'] = chartArr.slice(chartsLen);
      stateSwitch['charts'] = charts;
    
     this.setState(stateSwitch);


    } 
    switchIndices(e) {
      if (e.target.classList.contains('selected-li')) return 'yo';

      let ulType = e.target.dataset.key;

      if (ulType === "stocks") {
        this.setState({
          selectUl: "stocks",
          ulBlocked: <StockList used={this.state.seriesWatch} startChart={this.addNewChart.bind(this)}/>
        });
      }
      if (ulType === "forex") {
        this.setState({
          selectUl: "forex",
          ulBlocked: <ForexList used={this.state.seriesWatch} startChart={this.addNewChart.bind(this)}/>
        });
      }

    }
    setSpreadRef (spreadCntrl) {
     this.spreadRef = spreadCntrl;
    }
    updateSelect (series) {
      let ulType = this.state.selectUl;
      if (ulType === "stocks") {
        
         return <StockList used={series} startChart={this.addNewChart.bind(this)}/>
       
      } else {
      return <ForexList used={series} startChart={this.addNewChart.bind(this)}/>;
       
      }
    }
    optView (type) {
      let  currentClass =  "half-view";
      let dashview = this.state.platformView;
      if (type === this.state.optsComponent ){
       currentClass = this.state.tradViewClass === "full-view" ? "half-view" : "full-view";
      }
      if (type === "spreads" || type === "current-bids" || type === "da jie"){
        this.spreadRef.setting(type);
        currentClass === "half-view" ? this.spreadRef.inView() : this.spreadRef.outView();
        dashview = "live graphs";
      }
      if (type === "overview" ) {
          dashview = "trade history";
          currentClass = "full-view";
      }
      this.setState({tradViewClass: currentClass, 
        optsComponent: type,
        platformView: dashview
      });
    }
    liveFeedStarted(symbFeed) {
      let seriesWatch = this.state.seriesWatch;
      seriesWatch.push(symbFeed);
      this.setState({
        seriesWatch: seriesWatch,
        addButton: true
      });
    }
    addNewChart(symb, index) {
      let charts = this.state.charts;
      let chartSlots = this.state.chartSlots;
      let series = this.state.seriesWatch;
      series.push(symb);
      let slot = chartSlots.shift();
      charts[symb] = {
        slot: slot,
        symbol: symb
      };
      let chartsLen = Object.keys(charts).length;
      let chartClass = this.state.chartClass;
      if (chartsLen === 2) {
        chartClass[0] = "chart-box-50 col-sm-12";
      }
      if (chartsLen === 3) {
        chartClass[0] = "chart-box-50 td-reduce col-sm-6";
      }
      if (chartsLen === 4) {
        chartClass[1] = "chart-box-50 td-reduce col-sm-6";
      }
      let stateOB = {};
      if(this.state.totalCharts === 0){
      stateOB['blocked'] = null;
      stateOB['onStart'] = false;
      }

      stateOB['charts'] = charts;
      stateOB['chartSlots'] = chartSlots;
      stateOB['chartClass'] = chartClass;
      stateOB['addButton'] = true;
      stateOB['seriesWatch'] = series;
      stateOB['ulBlocked'] = this.updateSelect(series);
      stateOB['chartAddOpen'] = false;
      stateOB['totalCharts'] = this.state.totalCharts + 1;
      let keyy = symb + '_key';
      stateOB[slot] = <CanvasChart key={keyy}  clCtx={this.closeCrt.bind(this)} dataSource={this.dbSource} mainSym={symb} whenMounted={this.canvasPlaced.bind(this)} />;
      this.setState(stateOB);
    }
    
    startLiveFeed(symb) {
      let charts = this.state.charts;
      let series = this.state.seriesWatch;
      series.push(symb);
      let chartSlots = this.state.chartSlots;
      let slot = chartSlots.shift();
      charts[symb] = {
        slot: slot,
        symbol: symb
      };
      let stateOB = {};
      stateOB['charts'] = charts;
      stateOB['chartSlots'] = chartSlots;
      stateOB['blocked'] = null;
      stateOB['seriesWatch'] = series;
      stateOB['ulBlocked'] = this.updateSelect(series);
      stateOB['onStart'] = false;
      stateOB['totalCharts'] = 1;
       let keyy = symb + '_key';
      stateOB[slot] = <CanvasChart key={keyy}  clCtx={this.closeCrt.bind(this)} dataSource={this.dbSource} mainSym={symb} whenMounted={this.canvasPlaced.bind(this)} />;
      this.setState(stateOB);

    }
    
    canvasPlaced() {
      //this.ctxChart =  CtxChart();

    };
    canvasOut() {
      this.ctxChart.shutdown();
    }

    componentDidMount() {
      let self = this;
      this.dbSource.onopen = function (event) {
        self.setState({connected: true})
      };
     
      window.addEventListener("online", function(e){
        self.setState({connected: true});
        //self.dbSource = OpenWebsocket();
      }, false);
      window.addEventListener("offline", function(e){
        self.setState({connected: false});
      }, false);

    }
    componentWillMount() {
      

    }
    componentWillUnmount() {
      this.dbSource.close();
    }

  render() {
    let optsActive = this.state.optsComponent ? this.state.optsComponent : 'spreads';
    const onlineStatus = this.state.connected ? "Connected" : "Not Connected";
    let blocked = this.state.connected ? this.state.blocked : <LoadConnect />;
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
			        <div className={this.state.addButton ? "add-chart" : "add-chart no-see-no-click"} onClick={this.addChartMenu.bind(this)}>
			        <i className="material-icons">add</i>
			         </div>
			         <div id="chartAdOptions" className={this.state.chartAddOpen ? "" : "hide-elm"}>
		         			 <div className={this.state.totalCharts >= 4 ? "add-chart-warn" : "hide-elm"}>
                    <h3>You can only have 4 charts at a time, sorry!</h3>
                  </div>
                    <div className={this.state.totalCharts < 4 ? "add-chart-cnt" : "hide-elm"}>
                  <div className="column-two type-nav">
		         			
                    <ul onClick={this.switchIndices.bind(this)}>
		         				<li key={"stocks"} data-key="stocks" className={this.state.selectUl === "stocks" ?  "selected-li" : ""}>Stocks</li>
		         				<li key={"forex"} data-key="forex" className={this.state.selectUl === "forex" ? "selected-li" : ""}>Forex</li>
		         				</ul>
		         			</div>
		         			{this.state.ulBlocked}
                  </div>
                  
                 
			         </div>
                 <div id="connectedState">
                  <div className={this.state.connected ? "online-state online" : "online-state offline"}></div>
                  <span>{onlineStatus}</span>
                 </div>
		        </div>

		        <section id="realTimeTheme">
             
                {blocked}
                
             
              <div id="sideOptions"   className={this.state.onStart ? "hide-elm"  : ""}>
               <div onClick={this.optView.bind(this, 'overview')} className={optsActive === 'overview' ? "opts-button opts-active" : "opts-button"}><i className="material-icons">update</i><p>TRADING HISTORY</p></div>
               <div  className={optsActive === 'what' ? "opts-button opts-active" : "opts-button"}><i className="material-icons">dvr</i><p>OPTIONS</p></div>
                <div onClick={this.optView.bind(this, 'spreads')} className={optsActive === 'spreads'  ? "opts-button opts-active" : "opts-button"}><i className="material-icons">view_list</i><p>OPTIONS</p></div>
                <div onClick={this.optView.bind(this, 'current-bids')}  className={optsActive === 'current-bids' ? "opts-button opts-active" : "opts-button"}><i className="material-icons">watch_later</i><p>OPTIONS</p></div>
                <div onClick={this.optView.bind(this, 'view order')} className={optsActive === 'view order' ? "opts-button opts-active" : "opts-button"}><i className="material-icons">view_compact</i><p>OPTIONS</p></div>
              </div>
              <section id="optionsView"  className={this.state.onStart ? "hide-elm"  : "ok"}>
                <div className={optsActive === "spreads" ? "in-view-opts" : "hide-elm"}>
                   <ActiveSpreads setSpreadRef={this.setSpreadRef.bind(this)}  callCT={spreadCTX} dataSource={this.dbSource} />
                </div>
                 <div className={optsActive === "view order" ? "in-view-opts" : "hide-elm"}>
                  韓國女比中國女漂亮
                </div>
                
              </section>  
              <section id="tradingplatform" className={this.state.onStart ? "hide-elm"  :  this.state.tradViewClass}>
                 <div className={this.state.platformView === "live graphs" ? "wrap-block" : "hide-elm"}>
                  <div className={this.state.chart1 ? this.state.chartClass[0] : "hide-elm"}>
                 		 {this.state.chart1}
                  </div>
                  <div className={this.state.chart2 ? this.state.chartClass[0] : "hide-elm"}>
                		{this.state.chart2}
                  </div>
                  <div className={this.state.chart3 ? this.state.chartClass[1] : "hide-elm"}>
                		{this.state.chart3}
                	</div>
                 <div className={this.state.chart4 ? this.state.chartClass[1] : "hide-elm"}>
               			 {this.state.chart4}
               	 </div>
                </div>
                <div id="dashView" className={this.state.platformView === "trade history" ? "wrap-block" : "hide-elm"}>
                 <WidgetBlock/>
                </div>
             </section>
            </section>
            </div>
		        )
	
	}
};