import React from 'react';
import CallPut from './buysell';
import {
  CHART_STATE_UPDATE
} from 'constants/dashboard'

const chartOpts = (type) => {
  switch (type) {
    case 'candlestick':
      return <span data-tp='candlestick'>Candlestick<img data-tp='candlestick' height='18' src='/icons/candlestick.png'/></span>;
      break;
    case 'ohlc':
      return <span data-tp='ohlc'>OHLC<img data-tp='ohlc' height='18' src='/icons/ohlc.png'/></span>;
      break;
    case 'area':
      return <span data-tp='area'>Area<img data-tp='area' height='18' src='/icons/area.png'/></span>;
      break;
    case 'line':
      return <span data-tp='line'>Line<img data-tp='line' height='18' src='/icons/line.png'/></span>;
      break;
    default:
      return <span data-tp='area'>Area<img data-tp='area' height='18' src='/icons/area.png'/></span>;
  }
}

export default class CanvasChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dbSource = props.dataSource;
    this.dataPoints = [];

    this.feedWatch = props.mainSym;
    this.ctxChart = null;
    this.dbSource.dispatchEvent(this.feedWatch, (details) => this.liveUpdate(details));

  }
  dispatchChange = (payload) => this.props.dispatch({type: CHART_STATE_UPDATE, chartSymbol: this.props.mainSym, payload: payload})
  toggleModal = (bool) => () => this.dispatchChange({modalOpen: bool});
  toggleSets = (bool) => () => this.dispatchChange({optsOpen: bool});
  depositChanged = (num) => this.props.depChg(num);
  newPos = (pos) => this.props.newPos(pos);
  hideUL = () => this.dispatchChange({optsOpen: false});
  liveUpdate = (data) => this.ctxChart.dataStream(data);

  chartTypeSel = (e) => {
    if (e.target.className === 'selected-chart' || e.target.parentElement.className === 'selected-chart') {
      return '';
    }

    let chartType = e.target.dataset.tp;
    if (chartType) {
      this.dispatchChange({chartType: chartType, optsOpen: false});

      this.ctxChart.chartType(chartType);
    }
  }
  closeChart = () => {
    let feedExit = 'exit_' + this.props.mainSym;
    this.dbSource.send(feedExit);
    this.props.clCtx(this.props.mainSym)
  }

  componentDidMount() {
    this.ctxChart = this.props.ctx(this.props.mainSym);
    let symbChart = {};
    symbChart[this.props.mainSym] = {
      ctxChart: this.ctxChart,
      open: {}
    };
    this.props.whenMounted(symbChart);
    this.dbSource.send(this.props.mainSym);
    this.dispatchChange({callPut: this.props.mainSym});
  }
  componentWillUnmount() {
    //removeSeries
    let feedExit = 'exit_' + this.props.mainSym;
    this.dbSource.send(feedExit);
  }

  render() {
    const { state, mainSym } = this.props;
    const chartTypeLis = ['candlestick', 'area', 'ohlc', 'line'].map((itm, ii) => {
      let clName = state.chartType === itm ? 'selected-chart' : '';
      return <li key={'get-' + itm} data-tp={itm} className={clName}>
        {chartOpts(itm)}
      </li>;
    });
    return (

      <div className='real-time-chart'>
        <div id={this.props.mainSym} className='chartContainer reduct'></div>
        <div id={mainSym + '_trend'} className='chartContainer reduct trendline-ctx'>
          <canvas height='800' width='46' className='floatRights'></canvas>
        </div>
        <div className='chart-switch'>
          <div className='seclect-chart-butt'>
            <div onClick={this.toggleSets(true)} className={state.optsOpen ? 'hide-elm' : 'current-type'}>
              <span>{state.chartType}</span>
              <span>
                <i className='material-icons small-i'>arrow_drop_down</i>
              </span>
            </div>
            <ul className={state.optsOpen ? 'chart-select-ul' : 'hide-elm'} onMouseLeave={this.hideUL} onClick={this.chartTypeSel}>
              {chartTypeLis}
            </ul>
          </div>
          <div onClick={this.toggleModal(true)} className='chart-remove'>
            <span>Close</span>
            <i className='material-icons'>clear</i>
          </div>
        </div>
        {
          state.callPut !== null &&
          <CallPut mainSym={mainSym} newPos={this.newPos} depositChanged={this.depositChanged} ctxChart={this.ctxChart} timerId={mainSym + '_clock'} clockCtx={this.props.clock}/>
        }
        <div className={state.modalOpen ? 'warn-modal fade-in-fast' : 'hide-elm'}>
          <div className='heading-block'>
            <i className='material-icons'>warning</i>
            <span>FYI</span>
            <p>Closing this modal will close your Feed listener for
              <b>{this.props.mainSym}</b>
            </p>
            <div onClick={this.closeChart} className='cool-button agree-ok'>I know</div>
            <div onClick={this.toggleModal(false)} className='cool-button disagree-ok'>Nevermind</div>
          </div>
        </div>
      </div>
    )
  }
};
