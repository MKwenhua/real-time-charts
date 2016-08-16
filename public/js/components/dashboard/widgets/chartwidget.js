const React = require('react');
const ReactDOM = require('react-dom');
const ReactHighstock = require('../../react-highcharts/dist/ReactHighstock.src.js');

const graphConfigs = require("../../graphs/graphconfigs.js");
const dataFormat = require("../../graphs/data_transform.js");


export default class ChartWidget extends React.Component {
	 
    constructor(props) {
      super(props);
     
   }; 
  
   componentDidMount () {
    if(this.props.data.content.data === null){
    	this.props.cb(this.props.data.symb);
    }
  
    
   }
   componentWillMount () {
   
   
   }
   componentWillUnmount () {
    
   }
  render() { 
  	if (!this.props.data.content.data ) {
  		return (
        <div className="load-box">
        <div className="loading-pulse"></div>
        </div>);
  	}
      let graphType = this.props.data.content.graphType;
      let dataTransform = dataFormat[graphType]()
      let data =  this.props.data.content.data.map((dta) => {
            return  dataTransform(dta);
        });
       let config = graphConfigs[graphType]( this.props.data.content.data[0].symbol, data);
       
    
      return (<div className="chart-blocked">
     <ReactHighstock config={config} />
      <div className="widget-handle"> </div>
     </div>
       
      )
  
	}
};