import React from "react";
import InfoLi from "./history/infoli";
import StatTiles from "./history/statstiles";
import PositionView from "./history/positionview";

export default class TransactionList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.last = props.pastTrades.length;
    this.state = {
      active: 0,
      animate: true

    }
  };
  postionClick = (pos, ind) => this.setState({active: ind})
  render() {
    const {pastTrades, inView, SvgCB, GraphController} = this.props;
    const firstClass = (this.last < pastTrades.length && inView);
    const activeIndex = this.state.active ? this.state.active : 0;
    const pastTradeList = pastTrades.map((itm, i) => (
      <InfoLi
        clicked={this.postionClick}
        key={i}
        addStyle={i === 0 ? firstClass : false}
        active={activeIndex === i}
        index={i}
        animate={this.state.animate}
        pos={itm}/>
      )
    )
    return (
      <div className="container-fluid wrapper">
        <StatTiles SvgCB={SvgCB} tradeProps={this.props}/>
        <div className="head-line-list">
          <strong>Past Transactions</strong>
        </div>
        <div className="row">
          <div className="col-lg-7 col-md-6">
            <PositionView inView={inView} GraphController={GraphController} pos={pastTrades[activeIndex]}/>
          </div>
          <div className="trade-ul-list col-lg-5 col-md-6">
            <ul id="pastTrades">
              {pastTradeList}
            </ul>
          </div>
        </div>
      </div>
    )}
};
