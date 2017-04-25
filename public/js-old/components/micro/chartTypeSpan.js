const React = require('react');



export default class ChartTypeSpan extends React.Component {


render() {
   if (this.props.metric === 'OHLC' ) {
     return (  <div className="chart-types">
              <span  data-tp="candlestick" className={this.props.gType === 'candlestick' ? "set-at" : ""}>Box Plot</span>
              <span data-tp="ohlc" className={this.props.gType === 'ohlc' ? "set-at" : ""}>OHLC</span>
              </div>)
    }
    if (this.props.metric === 'PRICE' ) {
     return (  <div className="chart-types">
                <span data-tp="spline" className={this.props.gType === 'spline' ? "set-at" : ""}>Spline</span>
                <span data-tp="line" className={this.props.gType === 'line' ? "set-at" : ""}>Line</span>
                <span data-tp="step" className={this.props.gType === 'step' ? "set-at" : ""}>Step</span>
                </div>)
    }
    return (<div className="chart-types"></div>);
            
  }
};