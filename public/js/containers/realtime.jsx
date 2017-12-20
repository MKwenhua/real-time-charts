import React from 'react';
import {connect} from 'react-redux';
import LoadBars from 'components/loaders/loadbars';
import CtxChart from 'canvas/ctxChart';
import spreadCTX from 'canvas/spreadCTX';
import CardCtx from 'canvas/cardctx';
const Clock = require('canvas/clock.js');
import PositionTiles from 'canvas/positionTile';
import totalAmountCtx from 'canvas/depositamt';
import GraphController from 'helper/graph_controller';
import statSVGs from 'components/svg/statSVG';
import DATASOURCE from 'data/datasource';
import OpenWebsocket from 'data/gowebsocket';
import CanvasChart from 'dashboard/livegraph/canvaschart';
import ChartContainer from 'dashboard/chart_container';
import LiveStart from 'micro/livestart';
import LoadConnect from 'components/loaders/spinload';
import ForexList from 'micro/lists/forexlist';
import StockList from 'micro/lists/socklist';
import ActiveSpreads from 'dashboard/options/activespreads';
import WidgetBlock from 'dashboard/widgetblock';
import SideOptions from 'dashboard/sideoptions';
import TransactionList from 'dashboard/transactionlist';
import LiveTickers from 'dashboard/livetickers';
import WatchedSpreads from 'dashboard/options/watchedspreads';

import {
    ADD_CHART,
    CLOSE_CHART,
    CHART_STATE_UPDATE,
    FEED_START,
    OPTS_VIEW,
    SWITCH_INDICES,
    TOGGLE_CHART_MENU,
    CONNECTION_LOST,
    CONNECTED
} from 'constants/dashboard'

function select(store) {
  // How Different Redux stores get mapped to props
  return {rt: store.rt, trades: store.trades, trn: store.transactions}
}

class RealTime extends React.PureComponent {
  constructor(props) {
    super(props)
    this.tradePostions = {};
    this.dbSource = OpenWebsocket();
    this.spreadRef = null;
    this.SvgCB = statSVGs();
    this.cardCtx = CardCtx();

    this.dbSource.on.liveFeedStarted = (details) => this.liveFeedStarted(details);
    this.dbSource.onclose = (event) => this.wbClosed(event);
  }
  wbClosed = (event) => {
    console.log('Connection Closed');
    this.props.dispatch({
      type: CONNECTION_LOST,
      payload: {
        connected: false
      }
    });

  }
  depositChanged = (amt) => {
    let {deposit} = this.props.trades;
    let newAmount = deposit - Math.round(amt);
    window.showDiff(deposit, newAmount);
    this.props.dispatch({type: 'DEPOSIT_CHANGE', payload: newAmount});

  }
  addChartMenu = () => {
    this.props.dispatch({
      type: TOGGLE_CHART_MENU,
      payload: !this.props.rt.chartAddOpen
    })
  }

  closeCrt = (chrtSym) => {
    const {chartList, totalCharts} = this.props.rt;
    const stateUpdates = {
      chartList: chartList.filter((itm, i) => itm.symb !== chrtSym),
      totalCharts: totalCharts - 1,
      platformView: 'live graphs'

    }
    this.props.dispatch({type: CLOSE_CHART, payload: stateUpdates})
  }
  switchIndices = (indexType, alreadySelected) => () => {
    if (alreadySelected !== true) {
      this.props.dispatch({type: SWITCH_INDICES, payload: indexType});
    }
  }
  setSpreadRef = (spreadCntrl) => this.spreadRef = spreadCntrl;

  optView = (type) => {
    const dashview = this.props.rt.platformView;
    const {optsComponent, tradViewClass} = this.props.rt;

    switch (type) {
      case 'spreads':
        {
          this.spreadRef.setting(type);
          let currentClass = optsComponent === 'current-bids' ? 'half-view' : (tradViewClass === 'full-view' ? 'half-view' : 'full-view');
          currentClass === 'half-view' ? this.spreadRef.inView() : this.spreadRef.outView();
          PositionTiles.outView();
          this.setDashboardLayout(currentClass, type, dashview);
          return true;
        }
      case 'current-bids' : {
          let currentClass = optsComponent === 'spreads' ? 'half-view' : (tradViewClass === 'full-view' ? 'half-view' : 'full-view');
          currentClass === 'half-view' ? PositionTiles.inView() : PositionTiles.outView();
          this.spreadRef.outView();
          this.setDashboardLayout(currentClass, type, dashview);
          return true;
        }
      case 'past-pos' : {
          CtxChart.outOfView();
          Clock.outView();
          this.cardCtx.outView();
          this.spreadRef.outView();
          GraphController.renderCharts();
          this.SvgCB.inViewBool = true;
          this.SvgCB.inView();
          this.setDashboardLayout('full-view', type, 'trade list');
          return true;
        }
      case 'charts' : {
          this.spreadRef.outView();
          this.cardCtx.outView();
          Clock.inView();
          PositionTiles.outView();
          CtxChart.backInView();
          this.SvgCB.inViewBool = false;
          this.setDashboardLayout('full-view', type, 'live graphs');
          return true;
        }
      case 'live options' : {
          CtxChart.outOfView();
          Clock.outView();
          PositionTiles.outView();
          this.cardCtx.inView();
          this.SvgCB.inViewBool = false;
          this.spreadRef.outView();
          this.setDashboardLayout('full-view', type, 'live options');
          return true;
        }
      case 'overview' : {
          CtxChart.outOfView();
          Clock.outView();
          PositionTiles.outView();
          this.cardCtx.outView();
          this.spreadRef.outView();
          this.setDashboardLayout('full-view', type, 'trade history');
          return true;
        }

    }
    this.setDashboardLayout('half-view', type, dashview);
  }
  setDashboardLayout = (tradViewClass, optsComponent, platformView) => this.props.dispatch({
    type: OPTS_VIEW,
    payload: {
      tradViewClass,
      optsComponent,
      platformView
    }
  })
  liveFeedStarted = (symbFeed) => {
    let seriesWatch = this.props.rt.seriesWatch;
    seriesWatch.push(symbFeed);
    this.props.dispatch({
      type: FEED_START,
      payload: {
        seriesWatch: seriesWatch,
        addButton: true
      }
    })

  }
  addNewChart = (symb, index) => {
    const {chartList, totalCharts, chartPositions, chartStates } = this.props.rt;
    const keyy = symb + '_canvas';

    const stateUpdates = {
      chartPositions: {
        ...chartPositions,
        [symb]: {
          trades: [],
          position: {},
          total: 0.0,
          current: null
        }
      },
      chartStates: {
        ...chartStates,
        [symb]: {
          modalOpen: false,
          dataLength: 500,
          onStart: true,
          optsOpen: false,
          chartType: 'candlestick',
          mainSymbol: symb,
          callPut: null,
          seriesWatch: []
        }
      },
      chartList: chartList.concat({symb: symb, keyy: keyy}),
      totalCharts: totalCharts + 1,
      onStart: false,
      addButton: true,
      newSet: null,
      chartAddOpen: false
    }

    this.props.dispatch({type: ADD_CHART, payload: stateUpdates})
  }
  renderCanvasCharts = () => this.props.rt.chartList.map((chart, i, chartList) => (
    <ChartContainer key={chart.keyy} chartQnty={chartList.length} index={i}>
      <CanvasChart newPos={this.newPos} depChg={this.depositChanged} ctx={CtxChart.passCTXconstructor()} clock={Clock} positions={this.props.rt.chartPositions[chart.symb]} dispatch={this.props.dispatch} state={this.props.rt.chartStates[chart.symb]} clCtx={this.closeCrt} dataSource={this.dbSource} mainSym={chart.symb} whenMounted={this.canvasPlaced}/>
    </ChartContainer>
  ))

  canvasPlaced = (newSymb) => {
    this.tradePostions = Object.assign({}, this.tradePostions, newSymb);
  };
  tradeExpired = (pos) => {
    let {pastTrades, deposit, currentPos, totalRev, todayTotalNet} = this.props.trades;
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
    let posCTXcntrl = this.tradePostions[pos.symb].ctxChart;
    posCTXcntrl.posExpired(pos);
    window.showDiff(deposit, newDeoposit);

    this.SvgCB.upDate(pstTRD, (totalRev + diff));
    this.props.dispatch({
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
  newPos = (pos) => {
    let {deposit, currentPos, weeklyTradeCount, todayTradeCount} = this.props.trades;
    let newCurrentPos = [pos].concat(currentPos);
    let newAmount = deposit - Math.round(pos.unitPrice * pos.qty);
    window.showDiff(deposit, newAmount);
    this.tradePostions[pos.symb].open[pos.posId] = pos;
    let posCTXcntrl = this.tradePostions[pos.symb].ctxChart;
    posCTXcntrl.addNewPos(pos);
    this.props.dispatch({
      type: 'ADD_TRADE',
      payload: {
        currentPos: newCurrentPos,
        weeklyTradeCount: weeklyTradeCount + 1,
        todayTradeCount: todayTradeCount + 1,
        deposit: newAmount
      }
    });
    setTimeout(() => this.tradeExpired(pos), 60000 * pos.time);
  }
  canvasOut = () => this.ctxChart.shutdown();

  componentDidMount = () => {
    this.dbSource.onopen = (event) => this.props.dispatch({type: CONNECTED});
    window.addEventListener('online', (e) => this.props.dispatch({type: CONNECTED}), false);
    window.addEventListener('offline', (e) => this.props.dispatch({type: CONNECTION_LOST}), false);
    totalAmountCtx(this.props.trades.deposit);
  }

  componentWillMount() {
    if (this.dbSource.readyState === 'OPEN') {
      this.props.dispatch({type: CONNECTED});
    }
  }

  render() {
    const {
      optsComponent,
      onStart,
      platformView,
      tradViewClass,
      addButton,
      connected,
      seriesWatch,
      chartAddOpen,
      selectUl
    } = this.props.rt;
    let tdClass = tradViewClass === 'half-view';
    const onlineStatus = connected ? 'CONNECTED' : 'Not Connected';
    let blockStart = onStart ? <LiveStart startChart={this.addNewChart}/> : null;
    const blocked = this.props.rt.connected ? blockStart : <LoadConnect/>;
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
          <div className={addButton ? 'add-chart' : 'add-chart no-see-no-click'} onClick={this.addChartMenu}>
            <i className='material-icons'>add</i>
          </div>
          <div id='chartAdOptions' className={chartAddOpen ? '' : 'hide-elm'}>
            <div className={this.props.rt.totalCharts >= 4 ? 'add-chart-warn' : 'hide-elm'}>
              <h3>You can only have 4 charts at a time, sorry!</h3>
            </div>
            <div className={this.props.rt.totalCharts < 4 ? 'add-chart-cnt' : 'hide-elm'}>
              <div className='column-two type-nav'>
                <strong>Market</strong>
                <ul>
                  <li onClick={this.switchIndices('stocks', selectUl === 'stocks')} className={selectUl === 'stocks' ? 'selected-li' : ''}>Stocks</li>
                  <li onClick={this.switchIndices('forex', selectUl === 'forex')} className={selectUl === 'forex' ? 'selected-li' : ''}>Forex</li>
                </ul>
              </div>
              {
                selectUl === 'stocks' &&
                <StockList used={seriesWatch} startChart={this.addNewChart}/>
               }
              {
                selectUl === 'forex' &&
                <ForexList used={seriesWatch} startChart={this.addNewChart}/>
              }
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
          <SideOptions platformView={platformView} optsComponent={optsComponent} tdClass={tdClass} onStart={onStart} itmView={this.optView}/>
          <section id='optionsView' className={onStart ? 'hide-elm' : 'ok'}>
            <div className={optsComponent === 'spreads' ? 'in-view-opts' : 'hide-elm'}>
              <ActiveSpreads setSpreadRef={this.setSpreadRef} callCT={spreadCTX} dataSource={this.dbSource}/>
            </div>
            <div className={optsComponent === 'current-bids' ? 'in-view-opts' : 'hide-elm'}>
              <WatchedSpreads PositionTiles={PositionTiles} activePosList={this.props.trades.currentPos}/>
            </div>
          </section>
          <section id='tradingplatform' className={onStart ? 'hide-elm' : tradViewClass}>
            <div className={platformView === 'live graphs' ? 'wrap-block' : 'hide-elm'}>
              {
                this.props.rt.totalCharts === 0 &&
                <LiveStart startChart={this.addNewChart}/>
              }

              { this.renderCanvasCharts() }
            </div>
            <div id='dashView' className={platformView === 'trade history' ? 'wrap-block' : 'hide-elm'}>
              <WidgetBlock inView={platformView === 'trade history'}/>
            </div>
            <div className={platformView === 'trade list' ? 'wrap-block history-list' : 'hide-elm'}>
              <TransactionList inView={platformView === 'trade list'} GraphController={GraphController} SvgCB={this.SvgCB} pastTrades={this.props.trades.pastTrades}/>
            </div>
            <div className={platformView === 'live options' ? 'wrap-block history-list' : 'hide-elm'}>
              <LiveTickers cardCtx={this.cardCtx} inView={platformView === 'live options'}/>
            </div>
          </section>
        </section>
      </div>
    )
  }
};

export default connect(select)(RealTime);
