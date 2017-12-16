import React from 'react';
import {connect} from 'react-redux';
import LoadBars from 'components/loaders/loadbars';
const CtxChart = require('canvas/ctxChart.js');
const spreadCTX = require('canvas/spreadCTX.js');
const CardCtx = require('canvas/cardctx.js');
const Clock = require('canvas/clock.js');
const PositionTiles = require('canvas/positionTile.js');
const totalAmountCtx = require('canvas/depositamt.js');
const viewCntrl = require('helper/viewCntrl.js');
import statSVGs from 'components/svg/statSVG';
import DATASOURCE from 'service/datasource';
import OpenWebsocket from 'service/websocket';
import CanvasChart from 'dashboard/livegraph/canvaschart';
import LiveStart from 'micro/livestart';
import LoadConnect from 'components/loaders/spinload';
import TradeListBlock from 'micro/lists/trade_list'
import ActiveSpreads from 'dashboard/options/activespreads';
import WidgetBlock from 'dashboard/widgetblock';
import SideOptions from 'dashboard/sideoptions';
import TransactionList from 'dashboard/transactionlist';
import LiveTickers from 'dashboard/livetickers';
import WatchedSpreads from 'dashboard/options/watchedspreads';

const chartContainers = (charts) => {
  let chartsLen = charts.length;
  return charts.map((itm, i) => {
    let clName = (chartsLen === 4) ? 'chart-box-50 td-reduce col-sm-6 fade-in-fast' : 'chart-box-100 col-sm-12 fade-in-fast';
    if (chartsLen === 2) {
      clName = 'chart-box-50 col-sm-12 fade-in-fast'
    }
    if (chartsLen === 3) {
      clName = i === 2 ? 'chart-box-50 col-sm-12 fade-in-fast' : 'chart-box-50 td-reduce col-sm-6 fade-in-fast';
    }
    return <div key={itm.keyy} className={clName}>
      {itm.component}
    </div>;
  });

};
function canvasPlaced(tradePostions) {
  return (newSymb) => {
    tradePostions = Object.assign({}, tradePostions, newSymb);
  }
};
function addNewChart(props, tradePostions, dispatch) {
  return (symb, index) => {
    let stateOB = Object.assign({}, props.rt);
    let {chartList, chartsActive} = stateOB;
    let keyy = symb + '_canvas';

    stateOB.chartPositions[symb] = {
      trades: [],
      position: {},
      total: 0.0,
      current: null
    };
    let newCtx = {
      symb: symb,
      keyy: keyy,
      component: <CanvasChart newPos={newPosition(props.trades, tradePostions, setTradeExpired(props.trades, tradePostions, dispatch), dispatch)} depChg={depositChanged(props.trades, dispatch)} ctx={CtxChart.passCTXconstructor()} clock={Clock} positions={stateOB.chartPositions[symb]} clCtx={closeCrt(props, tradePostions, dispatch)} dataSource={dbSource} mainSym={symb} whenMounted={canvasPlaced(tradePostions)}/>
    };
    stateOB.chartList.push(newCtx);
    if (props.rt.totalCharts === 0) {
      stateOB['onStart'] = false;
    }
    stateOB.totalCharts = stateOB.chartList.length;
    stateOB['addButton'] = true;
    stateOB['newSet'] = null;
    stateOB['chartAddOpen'] = false;
    dispatch({type: 'ADD_CHART', payload: stateOB})
  }
}
function closeCrt(props, tradePostions, dispatch) {
  return (chrtSym) => {
    let {chartList, totalCharts} = props.rt;
    let stateSwitch = Object.assign({}, props.rt);
    let newChartTotal = totalCharts - 1;
    stateSwitch.chartList = chartList.filter((itm, i) => itm.symb !== chrtSym);
    stateSwitch['totalCharts'] = newChartTotal;
    stateSwitch['newSet'] = newChartTotal ? null : <LiveStart startChart={addNewChart(props, tradePostions, dispatch)}/>;
    stateSwitch['platformView'] = 'live graphs';
    dispatch({type: 'CLOSE_CHART', payload: stateSwitch})
  }
}
function setTradeExpired(trades, tradePostions, dispatch) {
  return (pos) => {
    let {pastTrades, deposit, currentPos, totalRev, todayTotalNet} = trades;
    let nwPnt = pos.getLatestPoint();
    let diff = (nwPnt.data[3] - pos.unitPrice) * pos.qty;
    let newNet = todayTotalNet + diff;
    let newDeoposit = Math.round(deposit + (nwPnt.data[3] * pos.qty));
    let newCrntPos = currentPos.filter((itm) => itm.ctxid !== pos.ctxid);
    let pstTRD = [
      {
        position: pos.symb,
        volume: pos.qty,
        date: new Date().toDateString(),
        short: pos.type === 'PUT',
        pricestart: (Math.round(pos.unitPrice * 100) / 100),
        priceend: (Math.round(nwPnt.data[3] * 100) / 100),
        profit: diff
      }
    ].concat(pastTrades);
    let posCTXcntrl = tradePostions[pos.symb].ctxChart;
    posCTXcntrl.posExpired(pos);
    window.showDiff(deposit, newDeoposit);

    SvgCB.upDate(pstTRD, (totalRev + diff));
    dispatch({
      type: 'TRADE_COMPLETE',
      payload: {
        deposit: newDeoposit,
        currentPos: newCrntPos,
        pastTrades: pstTRD,
        todayTotalNet: newNet,
        totalRev: totalRev + diff
      }
    });
  }
}
function newPosition(trades, tradePostions, tradeExpired, dispatch) {
  return (pos) => {
    let {deposit, currentPos, weeklyTradeCount, todayTradeCount} = trades;
    let newCurrentPos = [pos].concat(currentPos);
    let newAmount = deposit - Math.round(pos.unitPrice * pos.qty);
    window.showDiff(deposit, newAmount);
    tradePostions[pos.symb].open[pos.posId] = pos;
    let posCTXcntrl = tradePostions[pos.symb].ctxChart;
    posCTXcntrl.addNewPos(pos);
    dispatch({
      type: 'ADD_TRADE',
      payload: {
        currentPos: newCurrentPos,
        weeklyTradeCount: weeklyTradeCount + 1,
        todayTradeCount: todayTradeCount + 1,
        deposit: newAmount
      }
    });
    let timeOut = 60000 * pos.time;
    setTimeout(() => {
      tradeExpired(pos);
    }, timeOut);
  }
}

function depositChanged(trades, dispatch) {
  return (amt) => {
    let {deposit} = trades;
    let newAmount = deposit - Math.round(amt);
    window.showDiff(deposit, newAmount);
    dispatch({type: 'DEPOSIT_CHANGE', payload: newAmount});
  }
}
const dbSource = OpenWebsocket();
const SvgCB = statSVGs();
const cardCtx = CardCtx();

@connect((store) => {
  return {rt: store.rt, trades: store.trades, trn: store.transactions}
})
export default class RealTime extends React.PureComponent {
  constructor(props) {
    super(props)
    this.tradePostions = {};
    this.spreadRef = null;
    console.log('this.props in constructor', this.props);
    this.liveFeedStarted = this.liveFeedStarted.bind(this);

    this.optView = this.optView.bind(this);
    this.wbClosed = this.wbClosed.bind(this);
    this.setSpreadRef = this.setSpreadRef.bind(this);
    this.switchIndices = this.switchIndices.bind(this);
    this.resetCharts = this.resetCharts.bind(this);
    this.addChartMenu = this.addChartMenu.bind(this);
    dbSource.on.liveFeedStarted = (details) => this.liveFeedStarted(details);
    dbSource.onclose = (event) => this.wbClosed(event);

  }
  wbClosed = (event) => {
    console.log('Connection Closed');
    this.props.dispatch({
      type: 'CONNECTION_LOST',
      payload: {
        connected: false
      }
    })
  }
  addChartMenu() {
    this.props.dispatch({
      type: 'TOGGLE_CHART_MENU',
      payload: !this.props.rt.chartAddOpen
    })
  }
  switchIndices(e) {
    if (e.target.classList.contains('selected-li'))
      return 'yo';

    let ulType = e.target.dataset.key;

    if (ulType === 'stocks') {
      this.props.dispatch({type: 'SWITCH_INDICES', payload: 'stocks'});
    }
    if (ulType === 'forex') {
      this.props.dispatch({type: 'SWITCH_INDICES', payload: 'forex'});
    }

  }
  setSpreadRef(spreadCntrl) {
    this.spreadRef = spreadCntrl;
  }

  optView(type) {
    let currentClass = 'half-view';
    let dashview = this.props.rt.platformView;
    let {optsComponent, tradViewClass} = this.props.rt;

    switch (type) {
      case 'spreads':
        this.spreadRef.setting(type);
        currentClass = this.props.rt.optsComponent === 'current-bids' ? 'half-view' : (this.props.rt.tradViewClass === 'full-view' ? 'half-view' : 'full-view');
        currentClass === 'half-view' ? this.spreadRef.inView() : this.spreadRef.outView();
        PositionTiles.outView();
        break;
      case 'current-bids' : currentClass = this.props.rt.optsComponent === 'spreads' ? 'half-view' : (this.props.rt.tradViewClass === 'full-view' ? 'half-view' : 'full-view');
        currentClass === 'half-view' ? PositionTiles.inView() : PositionTiles.outView();
        this.spreadRef.outView();

        break;
      case 'past-pos' : dashview = 'trade list';
        currentClass = 'full-view';

        CtxChart.outOfView();
        Clock.outView();
        cardCtx.outView();
        this.spreadRef.outView();
        viewCntrl.renderCharts();
        SvgCB.inViewBool = true;
        SvgCB.inView();

        break;
      case 'charts' : currentClass = 'full-view';
        this.spreadRef.outView();
        cardCtx.outView();
        Clock.inView();
        PositionTiles.outView();
        CtxChart.backInView();
        SvgCB.inViewBool = false;
        dashview = 'live graphs';
        break;
      case 'live options' : {
          dashview = 'live options';
          currentClass = 'full-view';
          CtxChart.outOfView();
          Clock.outView();
          PositionTiles.outView();
          cardCtx.inView();
          SvgCB.inViewBool = false;
          this.spreadRef.outView();
          break;
        }
      case 'overview' : dashview = 'trade history';
        currentClass = 'full-view';
        CtxChart.outOfView();
        Clock.outView();
        PositionTiles.outView();
        cardCtx.outView();
        this.spreadRef.outView();
        break;

    }
    this.props.dispatch({
      type: 'OPTS_VIEW',
      payload: {
        tradViewClass: currentClass,
        optsComponent: type,
        platformView: dashview
      }
    });

  }
  liveFeedStarted(symbFeed) {
    let seriesWatch = this.props.rt.seriesWatch;
    seriesWatch[symbFeed] = true;
    this.props.dispatch({
      type: 'FEED_START',
      payload: {
        seriesWatch: seriesWatch,
        addButton: true
      }
    })

  }

  canvasOut() {
    this.ctxChart.shutdown();
  }

  componentDidMount() {
    let self = this;
    console.log('this.props', this.props);
    dbSource.onopen = function (event) {
      self.props.dispatch({type: 'CONNECTED', payload: true});
    };

    window.addEventListener('online', function (e) {
      self.props.dispatch({type: 'CONNECTED', payload: true});
    }, false);
    window.addEventListener('offline', function (e) {
      self.props.dispatch({type: 'CONNECTION_LOST', payload: false});
    }, false);
    totalAmountCtx(this.props.trades.deposit);
    console.log('real-time-props', this.props);
    if (this.props.rt.totalCharts) {
      //this.resetCharts();
    }
  }
  resetCharts() {
    let {seriesWatch, chartPositions, charts} = this.props.rt;
    let stateOB = Object.assign({}, this.props.rt);
    Object.keys(charts).forEach((symb, i) => {
      let slot = stateOB.charts[symb];
      let keyy = symb + '_key';
      stateOB[slot] = <CanvasChart key={keyy} newPos={this.newPos.bind(this)} depChg={this.depositChanged.bind(this)} ctx={CtxChart.passCTXconstructor()} clock={Clock} positions={chartPositions[symb]} clCtx={this.closeCrt.bind(this)} dataSource={dbSource} mainSym={symb} whenMounted={this.canvasPlaced.bind(this)}/>;
    });
    this.props.dispatch({type: 'RESET_CHARTS', payload: stateOB})
  }
  componentWillMount() {
    if (dbSource.readyState === 'OPEN') {
      this.props.dispatch({type: 'CONNECTED', payload: true});

    }

  }
  componentWillUnmount() {
    // this.dbSource.close();
  }

  render() {
    const {dispatch} = this.props;
    let {
      optsComponent,
      onStart,
      platformView,
      tradViewClass,
      seriesWatch,
      addButton,
      totalCharts,
      chartList,
      chartAddOpen,
      newSet,
      selectUl,
      connected
    } = this.props.rt;
    let {currentPos, pastTrades} = this.props.trades
    let tdClass = tradViewClass === 'half-view';
    const onlineStatus = connected ? 'Connected' : 'Not Connected';
    const addNewChartClosure = addNewChart(this.props, this.tradePostions, dispatch);
    let blockStart = onStart ? <LiveStart startChart={addNewChartClosure}/> : null;
    let blocked = connected ? blockStart : <LoadConnect/>;
    let allCharts = chartList.length ? chartContainers(chartList) : null;
    return (
      <div>
        <div id='rtTopNavUI'>
          <div className='fake-logo'>
            <span>
              <i className='material-icons'>language</i>
            </span>
            <span className='span-two'>
              Trade Stuff
            </span>
          </div>
          <div className={addButton ? 'add-chart' : 'add-chart no-see-no-click'} onClick={this.addChartMenu.bind(this)}>
            <i className='material-icons'>add</i>
          </div>
          <div id='chartAdOptions' className={chartAddOpen ? '' : 'hide-elm'}>
            <div className={totalCharts >= 4 ? 'add-chart-warn' : 'hide-elm'}>
              <h3>You can only have 4 charts at a time, sorry!</h3>
            </div>
            <div className={totalCharts < 4 ? 'add-chart-cnt' : 'hide-elm'}>
              <div className='column-two type-nav'>
                <strong>Market</strong>
                <ul onClick={this.switchIndices.bind(this)}>
                  <li key='stocks' data-key='stocks' className={selectUl === 'stocks' ? 'selected-li' : ''}>Stocks</li>
                  <li key='forex' data-key='forex' className={selectUl === 'forex' ? 'selected-li' : ''}>Forex</li>
                </ul>
              </div>
              {TradeListBlock(selectUl, seriesWatch, addNewChartClosure)}
            </div>

          </div>
          <div id='connectedState'>
            <div className={connected ? 'online-state online' : 'online-state offline'}></div>
            <span>{onlineStatus}</span>
          </div>
        </div>
        <div id='scorePoints' className={(platformView !== 'trade history' && !onStart) ? '' : 'hide-elm'}>

          <span className='count span-green total-earnings'>
            <canvas id='totalAccount' height={40} width={100}></canvas>
          </span>
          <span className='deposit-span'>DEPOSIT</span>

        </div>
        <section id='realTimeTheme'>

          {blocked}

          <SideOptions platformView={platformView} optsComponent={optsComponent} tdClass={tdClass} onStart={onStart} itmView={this.optView.bind(this)}/>

          <section id='optionsView' className={onStart ? 'hide-elm' : 'ok'}>
            <div className={optsComponent === 'spreads' ? 'in-view-opts' : 'hide-elm'}>
              <ActiveSpreads setSpreadRef={this.setSpreadRef.bind(this)} callCT={spreadCTX} dataSource={dbSource}/>
            </div>
            <div className={optsComponent === 'current-bids' ? 'in-view-opts' : 'hide-elm'}>
              <WatchedSpreads PositionTiles={PositionTiles} activePosList={currentPos}/>
            </div>
          </section>
          <section id='tradingplatform' className={onStart ? 'hide-elm' : tradViewClass}>
            <div className={platformView === 'live graphs' ? 'wrap-block' : 'hide-elm'}>
              {newSet}

              {allCharts}

            </div>
            <div id='dashView' className={platformView === 'trade history' ? 'wrap-block' : 'hide-elm'}>
              <WidgetBlock inView={platformView === 'trade history'}/>
            </div>
            <div className={platformView === 'trade list' ? 'wrap-block history-list' : 'hide-elm'}>
              <TransactionList inView={platformView === 'trade list'} viewCntrl={viewCntrl} SvgCB={SvgCB} pastTrades={pastTrades}/>
            </div>
            <div className={platformView === 'live options' ? 'wrap-block history-list' : 'hide-elm'}>
              <LiveTickers cardCtx={cardCtx} inView={platformView === 'live options'}/>
            </div>
          </section>
        </section>
      </div>
    )

  }
};
