import React from "react";
const makeGraph = require('canvas/ctxgraphs.js');

export default class MiniGraph extends React.PureComponent {

   componentDidMount() {
      let stuff = makeGraph(this.props.ctxId, this.props.data, "stuff")
      stuff.renderChart()
   }

   render() {

      return (
         <div id={this.props.ctxId} className="holds-graph donut-graph"></div>
      )

   }
};
