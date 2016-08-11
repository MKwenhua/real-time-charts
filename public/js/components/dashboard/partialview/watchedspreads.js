const React = require('react');



export default class WatchedSpreads extends React.Component {
   constructor(props) {
      super(props);
      this.CTXspread = null;
      this.dbSource = this.props.dataSource;
      this.state = {
         trackedBids: [],
         onView: false
      };

   }
   componentDidMount() {

   }
   componentWillMount() {


   }
   componentWillUnmount() {

   }
   render() {
      const {
         activePosList
      } = this.props;
      const posList = activePosList.length === 0 ? <div className="no-positions">No Active Positions</div> : null;
      return (<div className="active-spreads">
    			{posList}
              </div>)
   }
};