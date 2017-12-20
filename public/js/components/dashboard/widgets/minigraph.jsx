import React from "react";
import makeGraph from 'canvas/ctxgraphs.js';

export default class MiniGraph extends React.PureComponent {
  componentDidMount() {
    const chart = makeGraph(this.props.ctxId, this.props.data, this.props.data.title)
    chart.renderChart()
  }
  render() {
    return (
      <div id={this.props.ctxId} className="holds-graph donut-graph"></div>
    )
  }
};
