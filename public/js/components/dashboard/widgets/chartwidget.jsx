import React from "react";

const ReactHighstock = require('react-highcharts/ReactHighstock')

const graphConfigs = require("graph_helpers/graphconfigs.js");
const dataFormat = require("graph_helpers/data_transform.js");

export default class ChartWidget extends React.Component {

   constructor(props) {

      super(props);

      this.dataGen = null;
      this.state = {}

   };

   componentDidMount() {
      if (this.props.data.content.data === null) {
         this.props.cb(this.props.data.symb);
      }

   }
   render() {
      if (this.props.data.content.data === null) {
         return (
            <div className="load-box">
               <div className="loading-pulse"></div>
            </div>
         );
      }
      let graphType = this.props.data.content.graphType;
      let dataTransform = dataFormat[graphType]()
      let data = this.props.data.content.data.map((dta) => {
         return dataTransform(dta);
      });
      let config = graphConfigs[graphType](this.props.data.content.data[0].symbol, data);

      return (
         <div className="chart-blocked">
            <ReactHighstock config={config}/>
            <div className="widget-handle"></div>
         </div>

      )

   }
};
