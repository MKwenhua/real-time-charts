import React from 'react';

const postiveChange = (last, current) => ({
   pos: true,
   arrow: <i className='material-icons pos'>arrow_drop_up</i>,
   prnct: `+${String(((current - last) / last) * 100).slice(0, 4)}%`
})

const negativeChange = (last, current) => ({
      pos: false,
      arrow: <i className='material-icons neg'>arrow_drop_down</i>,
      prnct: `-${String(((last - current) / last) * 100).slice(0, 4)}%`
 })

export default class PositionView extends React.PureComponent {
   constructor(props) {
      super(props);
      props.GraphController.updatePosProps(props.pos);
   };
   percentChange = ({pricestart, priceend}) => pricestart < priceend ? postiveChange(pricestart, priceend) : negativeChange(pricestart, priceend);
   componentDidMount() {
      this.props.GraphController.createCharts(this.props.pos);
   }
   componentDidUpdate() {
      this.props.GraphController.updatePosProps(this.props.pos);
      this.props.GraphController.updateCharts();
   }
   currentProfit = () => {
     const { priceend, volume, pricestart} = this.props.pos;
     return '$' + String(Math.round((priceend * volume) - (pricestart * volume)))
   }
   render() {
      const { pos } = this.props;
      const percentage = this.percentChange(pos)
      return (
         <div className='view-trd fade-in'>
            <h3 className='under-line span-label-blue margin-btm-sm'>
               { pos.position }
             </h3>
             { pos.date}
            <div className='row pos-overview'>
               <div className='col-xs-2 pos-col pos-first'>
                  <strong>Positions</strong>
                  { pos.volume }
               </div>
               <div className='col-xs-2 pos-col'>
                  <strong>Start Value</strong>
                  { pos.pricestart }
               </div>

               <div className='col-xs-2 pos-col'>
                  <strong>End Value</strong>
                  { pos.priceend }
               </div>

               <div className='col-xs-3 pos-col'>
                  <strong>Change</strong>
                  <span>{ percentage.arrow }</span>
                  <span>{ percentage.prnct }</span>
               </div>
               <div className='col-xs-2 pos-col'>
                  <strong>Profit</strong>
                  <span className={percentage.pos ? 'span-green' : 'span-red'}>
                    {this.currentProfit()}
                  </span>
               </div>
            </div>
            <div className='row'>
               <div id='chart1view' className='ctx-charts-class'></div>
               <div id='chart2view' className='ctx-charts-class'></div>
            </div>
         </div>
      )
   }
};
