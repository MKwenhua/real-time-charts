import React from 'react';
const chartMaker = require('graph_helpers/charts.js');

const percentChange2 = (last, current) => {
  if (current > last) {
    return {
      pos: true, arrow: <i className='material-icons pos'>arrow_drop_up</i>,
      prnct: '+' + String(((current - last) / last) * 100).slice(0, 4) + '%'
    };
  } else {
    return {
      pos: false, arrow: <i className='material-icons neg'>arrow_drop_down</i>,
      prnct: '-' + String(((last - current) / last) * 100).slice(0, 4) + '%'
    };
  }
}
const askBidVolume = (bool, v1, v2) => {
  if (bool) {
    return [
      Math.max(v1, v2),
      Math.min(v1, v2)
    ]
  }
  return [
    Math.min(v1, v2),
    Math.max(v1, v2)
  ]

};
export default class PositionView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.chart1 = null;
    this.chart2 = null;
    this.state = {}
    this.props.viewCntrl.renderCharts = this.renderCharts.bind(this);
  };
  renderCharts() {
    let bool = this.props.pos.pricestart < this.props.pos.priceend;
    let askBid = askBidVolume(bool, (Math.floor(Math.random() * 10000) + 1000), (Math.floor(Math.random() * 10000) + 1000));

    let ratioData = [
      {
        y: askBid[0],
        name: 'Bid',
        fillOpacity: .9,
        legendText: 'Bid',
        color: '#30d94c'
      }, {
        y: askBid[1],
        name: 'Ask',
        fillOpacity: .9,
        legendText: 'Ask',
        color: 'red'
      }
    ];
    let pricestart = this.props.pos.pricestart;
    let self = this;
    setTimeout(() => {
      self.chart1.newSet(ratioData)
      self.chart2.genData(pricestart, 30);
    }, 70);

  }
  componentDidMount() {
    let bool = this.props.pos.pricestart < this.props.pos.priceend;
    let askBid = askBidVolume(bool, (Math.floor(Math.random() * 10000) + 1000), (Math.floor(Math.random() * 10000) + 1000));

    let ratioData = [
      {
        y: askBid[0],
        name: 'Bid',
        legendText: 'Bid',
        color: '#30d94c'
      }, {
        y: askBid[1],
        name: 'Ask',
        legendText: 'Ask',
        color: 'red'
      }
    ];
    let settings = {
      height: 150,
      animate: true,
      background: '#18252e',
      msAni: 900
    };
    this.chart1 = chartMaker.makeChart('chart1view', ratioData, 'doughnut', settings)
    //this.chart1.renderChart()
    this.chart2 = chartMaker.makeComboChart('chart2view', {
      price: this.props.pos.pricestart,
      len: 30
    }, {
      msAni: 900,
      aYmin: this.props.pos.pricestart * 0.8
    });

  }
  componentDidUpdate() {
    let bool = this.props.pos.pricestart < this.props.pos.priceend;
    let askBid = askBidVolume(bool, (Math.floor(Math.random() * 10000) + 1000), (Math.floor(Math.random() * 10000) + 1000));

    let ratioData = [
      {
        y: askBid[0],
        name: 'Bid',
        fillOpacity: .9,
        legendText: 'Bid',
        color: '#30d94c'
      }, {
        y: askBid[1],
        name: 'Ask',
        fillOpacity: .9,
        legendText: 'Ask',
        color: 'red'
      }
    ];
    this.chart1.newSet(ratioData)
    this.chart2.genData(this.props.pos.pricestart, 30);
  }
  componentWillMount() {}
  render() {
    let percentage = percentChange2(this.props.pos.pricestart, this.props.pos.priceend);
    let profit = '$' + String(Math.round((this.props.pos.priceend * this.props.pos.volume) - (this.props.pos.pricestart * this.props.pos.volume)));
    return (
      <div className='view-trd fade-in'>
        <h3 className='under-line span-label-blue margin-btm-sm'>
          {this.props.pos.position}</h3>
        {this.props.pos.date}
        <div className='row pos-overview'>

          <div className='col-xs-2 pos-col pos-first'>
            <strong>Positions</strong>
            {this.props.pos.volume}
          </div>
          <div className='col-xs-2 pos-col'>
            <strong>Start Value</strong>
            {this.props.pos.pricestart}
          </div>

          <div className='col-xs-2 pos-col'>
            <strong>End Value</strong>
            {this.props.pos.priceend}
          </div>

          <div className='col-xs-3 pos-col'>
            <strong>Change</strong>
            <span>{percentage.arrow}</span>
            <span>{percentage.prnct}</span>
          </div>
          <div className='col-xs-2 pos-col'>
            <strong>Profit</strong>
            <span className={percentage.pos ? 'span-green' : 'span-red'}>{profit}</span>
          </div>
        </div>
        <div className='row'>

          <div id='chart1view' className='ctx-charts-class'></div>
          <div id='chart2view' className='ctx-charts-class'></div>

        </div>
      </div>
    )

  }
};
