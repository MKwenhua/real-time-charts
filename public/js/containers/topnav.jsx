import React from "react";

export default class TopNav extends React.Component {

   constructor(props) {
      super(props);
   }
   goState(pp) {
      window.checkPath(pp);
   }

   render() {

      return (
         <nav id="topNav" className={this.props.theClass}>
            <span onClick={this.goState.bind(null, '/history')} className={(this.props.pathName === '/history' || this.props.pathName === '/') ? "blocked-at" : ""}>History</span>
            <span onClick={this.goState.bind(null, '/realtime')} className={this.props.pathName === '/realtime' ? "blocked-at" : ""}>Real Time</span>
            <span onClick={this.goState.bind(null, '/map')} className={this.props.pathName === '/map' ? "blocked-at" : ""}>Map Thing</span>
         </nav>

      );
   }
};
