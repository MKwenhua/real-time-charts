import React from 'react';
import DATASOURCE from "./data/datasource";
const Countries = require("./data/countries.js");
const Indicators = require("./data/indicators.js");

export default class Map extends React.Component {
	constructor(props) {
  super(props);
	  this.dbSource = DATASOURCE;
	  this.state = {

	  }
	 this.dbSource.socket.on('indicatorData',  (details) => this.gotData( details )); 
	 this.gotData = this.gotData.bind(this);
	 this.getDataCall = this.getDataCall.bind(this);
	}
	gotData (data){
		console.log('got indicators', data);
	}
	getDataCall (country) {
 		if (this.dbSource.connected) {
  		this.dbSource.getIndicatorSockets(country);
  	} else {
  		this.dbSource.getIndicatorXHR(country, this.gotData);
  	}
 	}
  componentDidMount () {
  	this.getDataCall('china');
  }
	render() {
	
    return (<div className="container">
						 <h2>成龍大哥</h2>
						</div>
            )
	}
};
