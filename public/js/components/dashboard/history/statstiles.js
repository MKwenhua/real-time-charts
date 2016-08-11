const React = require('react');



export default class StatTiles extends React.Component {
   constructor(props) {
      super(props);

   };

   componentWillMount() {

   }
   render() {

      return (
         <div id="statTiles" >
         
              <div className="col-xs-2 stat-tile border-none">
                <span className="top_span span-label-blue">Stuff</span>
                <div className="count">2500</div>
                 <span className="bottom_span">Thing</span>
              </div>
               <div className="col-xs-2 stat-tile">
                <span className="top_span span-label-blue">Stuff</span>
                <div className="count">2500</div>
                 <span className="bottom_span">Thing</span>
              </div>
               <div className="col-xs-2 stat-tile">
                <span className="top_span span-label-blue">Stuff</span>
                <div className="count span-red">2500</div>
                 <span className="bottom_span">Thing</span>
              </div>
               <div className="col-xs-2 stat-tile">
                <span className="top_span span-label-blue">Stuff</span>
                <div className="count span-green">2500</div>
                 <span className="bottom_span">Thing</span>
              </div>
               <div className="col-xs-2 stat-tile">
                <span className="top_span span-label-blue">Stuff</span>
                <div className="count">2500</div>
                 <span className="bottom_span">Thing</span>
              </div>
        
           </div>

      )
   }
};