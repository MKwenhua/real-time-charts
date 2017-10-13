import React from "react";

export default class SideOptions extends React.PureComponent {
   constructor(props) {
      super(props);
   }
   optView = (type) => () => {
      this.props.itmView(type);
   }
   render() {
      const {platformView, optsComponent, tdClass} = this.props;
      return (
         <div id="sideOptions" className={this.props.onStart ? "hide-elm" : ""}>
            <div onClick={this.optView('overview')} className={platformView === "trade history" ? "opts-button opts-active-sec" : "opts-button"}>
               <i className="material-icons">update</i>
               <p>TRADING HISTORY</p>
            </div>
            <div onClick={this.optView('charts')} className={platformView === "live graphs" ? "opts-button opts-active-sec" : "opts-button"}>
               <i className="fa fa-line-chart fix-fa" aria-hidden="true"></i>
               <p>CHARTS</p>
            </div>
            <div onClick={this.optView('current-bids')} className={(optsComponent === 'current-bids' && tdClass) ? "opts-button opts-active" : "opts-button"}>
               <i className="material-icons">event_available</i>
               <p>POSITIONS</p>
            </div>
            <div onClick={this.optView('spreads')} className={(optsComponent === 'spreads' && tdClass) ? "opts-button opts-active" : "opts-button"}>
               <i className="material-icons">view_list</i>
               <p>OPTIONS</p>
            </div>
            <div onClick={this.optView('live options')} className={platformView === "live options" ? "opts-button opts-active-sec" : "opts-button"}>
               <i className="material-icons">view_compact</i>
               <p>OPTIONS</p>
            </div>
            <div onClick={this.optView('past-pos')} className={platformView === "trade list" ? "opts-button opts-active-sec" : "opts-button"}>
               <i className="material-icons">watch_later</i>
               <p>HISTORY</p>
            </div>

         </div>

      )
   }
};
