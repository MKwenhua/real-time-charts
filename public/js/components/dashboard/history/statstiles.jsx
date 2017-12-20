import React from 'react';
import Stat from 'svg/stat';

const svg1 = {
   plusValue: 0,
   buffer: 11,
   domElem: null,
   type: 'number',
   animate: true,
   fillChange: false,
   lastValue: 0,
   current: 0,
   name: 'svg1'
};
const svg2 = {
   plusValue: 0,
   type: 'float',
   buffer: 11,
   domElem: null,
   animate: true,
   fillChange: true,
   lastValue: 0.0,
   current: 0.0,
   name: 'svg2'
};
const svg3 = {
   plusValue: 0,
   buffer: 11,
   domElem: null,
   type: 'float',
   fillChange: true,
   animate: true,
   lastValue: 0.0,
   current: 0.0,
   name: 'svg3'
}
const svg4 = {
   plusValue: 0,
   buffer: 11,
   domElem: null,
   type: 'float',
   fillChange: true,
   animate: true,
   lastValue: 0,
   current: 0,
   name: 'svg4'
}
const svg5 = {
   plusValue: 0,
   buffer: 11,
   domElem: null,
   type: 'number',
   fillChange: false,
   animate: true,
   lastValue: 0,
   current: 0,
   name: 'svg5'
}

export default class StatTiles extends React.PureComponent {
   render() {
      let {tradeProps} = this.props;
      return (
         <div id='statTiles'>

            <div className='col-xs-2 stat-tile border-none'>
               <span className='top_span span-label-white'>Weekly Transactions</span>

               <Stat svgId={'svg1'} SvgCB={this.props.SvgCB} config={svg1} fillColor={'#00d8ff'} classType={'svg-count'}/>
               <span className='bottom_span'>Thing</span>
            </div>
            <div className='col-xs-2 stat-tile'>
               <span className='top_span span-label-white'>Current Total</span>
               <Stat svgId={'svg2'} SvgCB={this.props.SvgCB} config={svg2} fillColor={'#00d8ff'} classType={'svg-count'}/>
               <span className='bottom_span'>Thing</span>
            </div>
            <div className='col-xs-2 stat-tile'>
               <span className='top_span span-label-white'>Wk-on-Wk Gains</span>
               <Stat svgId={'svg3'} SvgCB={this.props.SvgCB} config={svg3} fillColor={'#DC143C'} classType={'svg-count'}/>
               <span className='bottom_span'>Thing</span>
            </div>
            <div className='col-xs-2 stat-tile'>
               <span className='top_span span-label-white'>Today's Profit</span>

               <Stat svgId={'svg4'} SvgCB={this.props.SvgCB} config={svg4} fillColor={'#30d94c'} classType={'svg-count'}/>

               <span className='bottom_span'>Thing</span>
            </div>
            <div className='col-xs-2 stat-tile'>
               <span className='top_span span-label-white'>Volume Traded</span>

               <Stat svgId={'svg5'} SvgCB={this.props.SvgCB} config={svg5} fillColor={'#00d8ff'} classType={'svg-count'}/>

               <span className='bottom_span'>Thing</span>
            </div>

         </div>

      )
   }
};
