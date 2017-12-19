import React from 'react';

class ChartContainer extends React.PureComponent {
  containerClassName({chartQnty, index}) {
    if (chartQnty === 1) {
      return 'chart-box-100 col-sm-12 fade-in-fast'
    }
    if (chartQnty === 2 ) {
      return 'chart-box-50 col-sm-12 fade-in-fast';
    }
    if (chartQnty === 3) {
      return index === 2 ? 'chart-box-50 col-sm-12 fade-in-fast' : 'chart-box-50 td-reduce col-sm-6 fade-in-fast';
    }
    return 'chart-box-50 td-reduce col-sm-6 fade-in-fast'

  }
  render() {
    return (
      <div className={this.containerClassName(this.props)}>
        {this.props.children}
      </div>
    )
  }
}

export default ChartContainer;
