const React = require('react');
import StatTiles from "./history/statstiles";


export default class LiveTickers extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         active: 0,
         animate: true

      }
      this.postionClick = this.postionClick.bind(this);
   };
   postionClick(pos, ind) {
      this.setState({
         active: ind
      })
   }

   componentWillMount() {

   }
   render() {

      return (<div className="container-fluid wrapper"> 
            <StatTiles />
           <h1>Live Tickers</h1>
        </div>)
   }
};