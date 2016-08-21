const React = require('react');
import InfoLi from "./history/infoli";
import StatTiles from "./history/statstiles";
import PositionView from "./history/positionview";

export default class TransactionList extends React.Component {
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
      const {
         pastTrades,
         inView
      } = this.props;
      let activeNum = this.state.active ? this.state.active : 0;
      const pastTradeList = this.props.pastTrades.map((itm, i) => {
         return <InfoLi clicked={this.postionClick.bind(this)} key={i+ '_trade'} active={activeNum === i} index={i} animate={this.state.animate} pos={itm} />
      });
      return (<div className="container-fluid wrapper"> 
            <StatTiles  SvgCB={ this.props.SvgCB} tradeProps={this.props} />
            <div className="head-line-list">
            <strong>Past Transactions</strong>
            </div>
            <div className="row">
            <div className="col-lg-7 col-md-6">
            <PositionView inView={inView} pos={pastTrades[activeNum]}/>
            </div>
                <div className="trade-ul-list col-lg-5 col-md-6"> 
                    <ul id="pastTrades">
                    {pastTradeList}
                    </ul>
                     </div>
              </div>
        </div>)
   }
};