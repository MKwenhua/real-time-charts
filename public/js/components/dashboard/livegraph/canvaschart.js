import React from 'react';

import CallPut from './buysell';

const chartOpts = (type) => {
   switch (type) {
      case "candlestick":
         return <span data-tp="candlestick">Candlestick<img data-tp="candlestick" height="18" src="/icons/candlestick.png"/></span>;
         break;
      case "ohlc":
         return <span data-tp="ohlc">OHLC<img data-tp="ohlc" height="18" src="/icons/ohlc.png"/></span>;
         break;
      case "area":
         return <span data-tp="area">Area<img data-tp="area" height="18" src="/icons/area.png"/></span>;
         break;
      case "line":
         return <span data-tp="line">Line<img data-tp="line" height="18" src="/icons/line.png"/></span>;
         break;
      default:
         return <span data-tp="area">Area<img data-tp="area" height="18" src="/icons/area.png"/></span>;
   }
}

const setCallPut = (canvasChartContext) => {
  if(canvasChartContext.bidReady === false) return null
  let { ctx, mainSym, whenMounted, newPos, clock } = canvasChartContext.props

   return  <CallPut mainSym={mainSym} newPos={newPos} depositChanged={canvasChartContext.depositChanged.bind(canvasChartContext)} ctxChart={canvasChartContext.ctxChart} timerId={mainSym + '_clock'} clockCtx={clock}/>
}
export default class CanvasChart extends React.Component {
   constructor(props) {
      super(props);
      this.dbSource = this.props.dataSource;
      this.dataPoints = [];
      this.callPut = null;
      this.feedWatch = this.props.mainSym;
      this.ctxChart = null;
      this.state = {
         modalOpen: false,
         dataLength: 500,
         onStart: true,
         optsOpen: false,
         chartType: this.ctxChart ? this.ctxChart.getChartType() : "candlestick",
         mainSymbol: this.props.mainSym,
         bidReady: false,
         seriesWatch: {}
      };
      this.liveUpdate = this.liveUpdate.bind(this);
      this.hideUL = this.hideUL.bind(this);
      this.toggleSets = this.toggleSets.bind(this);
      this.closeChart = this.closeChart.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
      this.depositChanged = this.depositChanged.bind(this);
      this.chartTypeSel = this.chartTypeSel.bind(this);
      this.dbSource.dispatchEvent(this.feedWatch, (details) => this.liveUpdate(details));

   }
   toggleModal(bool) {
      this.setState({modalOpen: bool});
   }
   closeChart() {
      let feedExit = "exit_" + this.props.mainSym;
      this.dbSource.send(feedExit);
      this.props.clCtx(this.props.mainSym)
   }
   toggleSets(bool) {
      this.setState({optsOpen: bool});
   }
   depositChanged(num) {
      this.props.depChg(num);
   }
   hideUL() {
      this.setState({optsOpen: false});
   }
   chartTypeSel(e) {
      if (e.target.className === "selected-chart" || e.target.parentElement.className === "selected-chart") {
         return '';
      }

      let chartType = e.target.dataset.tp;
      if (chartType) {
         this.setState({chartType: chartType, optsOpen: false});

         this.ctxChart.chartType(chartType);
      }
   }
   componentDidMount() {
     const { whenMounted,  mainSym, ctx } = this.props
     this.ctxChart = ctx(mainSym);
     const symbChart = {};
     symbChart[mainSym] = {
        ctxChart: this.ctxChart,
        open: {}
     };
     whenMounted(symbChart);
     this.dbSource.send(mainSym);
     this.setState({ bidReady: true })
      //this.setState({callPut: <CallPut mainSym={mainSym} newPos={newPos} depositChanged={this.depositChanged.bind(this)} ctxChart={this.ctxChart} timerId={mainSym + '_clock'} clockCtx={clock}/>});
   }
   componentWillUnmount() {
      //removeSeries
      let feedExit = "exit_" + this.props.mainSym;
      this.dbSource.send(feedExit);
   }
   liveUpdate(data) {
      this.ctxChart.dataStream(data);
   }

   render() {
      let trendLine = this.props.mainSym + '_trend';
      const chartTypeLis = ['candlestick', 'area', 'ohlc', 'line'].map((itm, ii) => {
         let clName = this.state.chartType === itm ? "selected-chart" : "";
         return <li key={"get-" + itm} data-tp={itm} className={clName}>
            {chartOpts(itm)}
         </li>;
      });
      const callPut = setCallPut(this)
      return (

         <div className="real-time-chart">
            <div id={this.props.mainSym} className="chartContainer reduct"></div>
            <div id={trendLine} className="chartContainer reduct trendline-ctx">
               <canvas height="800" width="46" className="floatRights"></canvas>
            </div>
            <div className="chart-switch">
               <div className="seclect-chart-butt">
                  <div onClick={this.toggleSets.bind(this, true)} className={this.state.optsOpen ? "hide-elm" : "current-type"}>
                     <span>{this.state.chartType}</span>
                     <span>
                        <i className="material-icons small-i">arrow_drop_down</i>
                     </span>
                  </div>
                  <ul className={this.state.optsOpen ? "chart-select-ul" : "hide-elm"} onMouseLeave={this.hideUL.bind(this)} onClick={this.chartTypeSel.bind(this)}>
                     {chartTypeLis}
                  </ul>
               </div>
               <div onClick={this.toggleModal.bind(this, true)} className="chart-remove">
                  <span>Close</span>
                  <i className="material-icons">clear</i>
               </div>
            </div>

            {callPut}
            <div className={this.state.modalOpen ? "warn-modal fade-in-fast" : "hide-elm"}>
               <div className="heading-block">
                  <i className="material-icons">warning</i>
                  <span>FYI</span>
                  <p>Closing this modal will close your Feed listener for
                     <b>{this.props.mainSym}</b>
                  </p>
                  <div onClick={this.closeChart.bind(this)} className="cool-button agree-ok">I know</div>
                  <div onClick={this.toggleModal.bind(this, false)} className="cool-button disagree-ok">Nevermind</div>
               </div>
            </div>
         </div>

      )
   }
};
