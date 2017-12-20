import React from 'react';

const ReactHighstock = require('react-highcharts/ReactHighstock')

import graphConfigs from 'graph_helpers/graphconfigs';
import dataFormat from 'graph_helpers/data_transform';

export default class ChartWidget extends React.PureComponent {
  constructor(props) {
    super(props);
    this.dataGen = null;
  };

  componentDidMount() {
    if (this.props.data.content.data === null) {
      this.props.cb(this.props.data.symb);
    }

  }
  nullData = () => (
    <div className='load-box'>
      <div className='loading-pulse'></div>
    </div>
  )

  render() {
    if (this.props.data.content.data === null) {
      return this.nullData()
    }
     const graphType = this.props.data.content.graphType;
     const dataTransform = dataFormat[graphType]()
     const contentData = this.props.data.content.data.map( data => dataTransform(data));
     const config = graphConfigs[graphType](this.props.data.content.data[0].symbol, contentData);

    return (
      <div className='chart-blocked'>
        <ReactHighstock config={config}/>
        <div className='widget-handle'></div>
      </div>
    )
  }
};
