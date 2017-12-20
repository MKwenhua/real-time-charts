import React from 'react';
import DATASOURCE from 'data/datasource';
import Countries  from 'data/countries';
import Indicators from 'data/indicators';

export default class Map extends React.PureComponent {
   constructor(props) {
      super(props);
      this.dbSource = DATASOURCE;
      this.state = {
         continent: 'ASIA',
         country: 'China',
         dataBlob: null
      }
   }
   gotData = (data) => {
      console.log('got indicators', data);
      let theData = {};
      theData.sec1 = data[0][0];
      theData.sec2 = data[1].reduce((ob, itm, i) => {
         let t = 'index_' + i;
         ob[t] = itm;
         return ob;
      }, {});
      let dta = JSON.stringify(theData, undefined, 2);
      this.refs.regionSelect
      this.setState({dataBlob: dta});

   }
   getDataCall = (country) => {
      this.dbSource.getIndicatorXHR(country, this.gotData);
   }
   countryChange = (e) => {
      let ex = e.target.value;

      this.setState({country: ex});
   }
   continentChange = (e) => {
      let ex = e.target.value;

      this.setState({continent: ex, country: Countries[ex][0]
      });
   }
   getIndicator = () => {
      let cntry = this.refs.countrySelect.value;
      this.getDataCall(cntry);
   }
   componentDidMount() {
      this.getDataCall('china');
      console.log('Countries', Countries);
   }
   render() {
      let {continent, country, dataBlob} = this.state;
      let countryOpts = Countries[continent].map((cntry, ii) => {

         return <option key={cntry + '_' + ii} value={cntry}>{cntry}</option>;

      });
      return (
         <div id='mapContainer' className='container'>
            <h2>Econ Indicators</h2>
            <div className='row col-center-sele'>
               <div className='select-col-maps'>
                  <strong>Continent:</strong>
                  <select ref='regionSelect' className='symbol-pick live-sym' value={continent} onChange={this.continentChange }>
                     <option key='AFRICA-KEY' value='AFRICA'>AFRICA</option>
                     <option key='AMERICA-KEY' value='AMERICA'>AMERICA</option>
                     <option key='ASIA-KEY' value='ASIA'>ASIA</option>
                     <option key='AUSTRALIA-KEY' value='AUSTRALIA'>AUS/PACIFIC</option>
                     <option key='EUROPE-KEY' value='EUROPE'>EUROPE</option>
                  </select>
               </div>
               <div className='select-col-maps'>
                  <strong>Country:</strong>
                  <select ref='countrySelect' value={country} className='symbol-pick live-sym' onChange={this.countryChange }>
                     {countryOpts}
                  </select>
               </div>
            </div>
            <div className='row text-center'>
               <div onClick={this.getIndicator } className='big-butt get-indicators-butt'>Get Indicators</div>
            </div>
            <pre className='row jsonblob'>
					{dataBlob}
				</pre>
         </div>
      )
   }
};
