import React from 'react';
import DATASOURCE from "./data/datasource";
const Countries = require("./data/countries.js");
const Indicators = require("./data/indicators.js");


export default class Map extends React.Component {
   constructor(props) {
      super(props);
      this.dbSource = DATASOURCE;
      this.state = {
         continent: 'ASIA',
         country: 'China',
         dataBlob: null
      }
      this.gotData = this.gotData.bind(this);
      this.getDataCall = this.getDataCall.bind(this);
      this.continentChange = this.continentChange.bind(this);
      this.getIndicator = this.getIndicator.bind(this);
   }
   gotData(data) {
      console.log('got indicators', data);
      let theData = {};
      theData.sec1 = data[0][0];
      theData.sec2 = data[1].reduce((ob,itm, i) => {
        let t = 'index_' + i;
        ob[t] = itm;
        return ob;
      },{});
      let dta = JSON.stringify(theData, undefined, 2);
      this.setState({
         dataBlob: dta
      });

   }
   getDataCall(country) {
      this.dbSource.getIndicatorXHR(country, this.gotData);
   }
   continentChange(e) {
      let ex = e.target.value;

      this.setState({
         continent: ex,
         country: Countries[ex][0]
      });
   }
   getIndicator() {
      let cntry = this.refs.countrySelect.value;
      this.getDataCall('china');
   }
   componentDidMount() {
      this.getDataCall('china');
      console.log('Countries', Countries);
   }
   render() {
      let {
         continent,
         country,
         dataBlob
      } = this.state;
      let countryOpts = Countries[continent].map((cntry, ii) => {

         return <option key={cntry + '_' + ii} value={cntry} >{cntry}</option>;

      });
      return (<div id="mapContainer" className="container">
						 <h2>成龍大哥</h2>
				<div className="row col-center-sele">
						 <div className="select-col-maps">
						         <strong>Continent:</strong>
								 <select ref="regionSelect"
								         className="symbol-pick live-sym"
								         value={continent}
								         onChange={this.continentChange.bind(this)} >
								 	 <option key='AFRICA-KEY' value="AFRICA">AFRICA</option>
									 <option key='AMERICA-KEY' value="AMERICA">AMERICA</option>
									 <option key='ASIA-KEY' value="ASIA">ASIA</option>
									 <option key='AUSTRALIA-KEY' value="AUSTRALIA">AUS/PACIFIC</option>
									 <option key='EUROPE-KEY' value="EUROPE">EUROPE</option>
								 </select>
						 </div>
						 <div className="select-col-maps">
						         <strong>Country:</strong>
								 <select ref="countrySelect"
								 		 value={country}
								         className="symbol-pick live-sym">
								  {countryOpts}
								 </select>
				  		</div>
				  </div>
				  <div className="row text-center">
		          	<div onClick={this.getIndicator.bind(this)} className="big-butt get-indicators-butt">Get Indicators</div>
		          </div>
				<pre className="row jsonblob">
					{dataBlob}
				</pre>

			   </div>)
   }
};