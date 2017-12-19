import React from 'react';

import CallPut from 'micro/buysell';

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
    this.state = {
      modalOpen: false,
      dataLength: 500,
      onStart: true,
      optsOpen: false,
      chartType: this.ctxChart ? this.ctxChart.getChartType() : 'candlestick',
      mainSymbol: props.mainSym,
      callPut: null,
      seriesWatch: []
    };

    console.log('this.props.positions', props.positions);
    this.dbSource.dispatchEvent(this.feedWatch, (details) => this.liveUpdate(details));

  }
  toggleModal = (bool) => () => this.setState({modalOpen: bool});
  closeChart = () => {
    const feedExit = 'exit_' + this.props.mainSym;
    this.dbSource.send(feedExit);
    this.props.clCtx(this.props.mainSym)
  }
  toggleSets = (bool) => () => this.setState({optsOpen: bool});
  depositChanged = (num) => this.props.depChg(num);
  newPos = (pos) => this.props.newPos(pos);
  hideUL = () => this.setState({optsOpen: false});
  chartTypeSel = (e) => {
    if (e.target.className === 'selected-chart' || e.target.parentElement.className === 'selected-chart') {
      return '';
    }

    let chartType = e.target.dataset.tp;
    if (chartType) {
      this.setState({chartType: chartType, optsOpen: false});

      this.ctxChart.chartType(chartType);
    }
  }
  componentDidMount() {
    this.props.whenMounted();
    this.ctxChart = this.props.ctx(this.props.mainSym);
    this.dbSource.send(this.props.mainSym);
    this.setState({callPut: <CallPut mainSym={this.props.mainSym} newPos={this.newPos} depositChanged={this.depositChanged} ctxChart={this.ctxChart} timerId={this.props.mainSym + '_clock'} clockCtx={this.props.clock}/>});
  }
  componentWillUnmount() {
    //removeSeries
    let feedExit = 'exit_' + this.props.mainSym;
    this.dbSource.send(feedExit);
  }
  liveUpdate = (data) => {
    this.ctxChart.dataStream(data);
  }

  render() {
    const chartTypeLis = ['candlestick', 'area', 'ohlc', 'line'].map((itm, ii) => {
      let clName = this.state.chartType === itm ? 'selected-chart' : '';
      return <li key={'get-' + itm} data-tp={itm} className={clName}>
        {chartOpts(itm)}
      </li>;
    });
    return (
      <div className='real-time-chart'>
        <div id={this.props.mainSym} className='chartContainer reduct'></div>
        <div className='chart-switch'>
          <div className='seclect-chart-butt'>
            <div onClick={this.toggleSets(true)} className={this.state.optsOpen ? 'hide-elm' : 'current-type'}>
              <span>{this.state.chartType}</span>
              <span>
                <i className='material-icons small-i'>arrow_drop_down</i>
              </span>
            </div>
            <ul className={this.state.optsOpen ? 'chart-select-ul' : 'hide-elm'} onMouseLeave={this.hideUL} onClick={this.chartTypeSel}>
              {chartTypeLis}
            </ul>
          </div>
          <div onClick={this.toggleModal(true)} className='chart-remove'>
            <span>Close</span>
            <i className='material-icons'>clear</i>
          </div>
        </div>

        {this.state.callPut}
        <div className={this.state.modalOpen ? 'warn-modal fade-in-fast' : 'hide-elm'}>
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
