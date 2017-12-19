import React from 'react';

export default class ChartTypeSpan extends React.PureComponent {
  render() {
    const {gType, metric} = this.props;
    if (metric === 'OHLC') {
      return (
        <div className='chart-types'>
          <span data-tp='candlestick' className={gType === 'candlestick' ? 'set-at' : ''}>Box Plot</span>
          <span data-tp='ohlc' className={gType === 'ohlc' ? 'set-at' : ''}>OHLC</span>
        </div>
      )
    }
    if (metric === 'PRICE') {
      return (
        <div className='chart-types'>
          <span data-tp='spline' className={gType === 'spline' ? 'set-at' : ''}>Spline</span>
          <span data-tp='line' className={gType === 'line' ? 'set-at' : ''}>Line</span>
          <span data-tp='step' className={gType === 'step' ? 'set-at' : ''}>Step</span>
        </div>
      )
    }
    return (
      <div className='chart-types'></div>
    );

  }
};
