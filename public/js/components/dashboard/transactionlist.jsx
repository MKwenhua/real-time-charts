import React from 'react';
import InfoLi from './history/infoli';
import StatTiles from './history/statstiles';
import PositionView from './history/positionview';

export default class TransactionList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.last = this.props.pastTrades.length;
    this.state = {
      active: 0,
      animate: true

    }
    this.postionClick = this.postionClick.bind(this);
  };
  postionClick = (pos, ind) => {
    this.setState({active: ind})
  }

  render() {
    const {pastTrades, inView} = this.props;
    let firstClass = (this.last < pastTrades.length && inView);
    let activeNum = this.state.active ? this.state.active : 0;
    const pastTradeList = this.props.pastTrades.map((itm, i) => {
      let hy = i === 0 ? firstClass : false;
      return <InfoLi clicked={this.postionClick} key={i + '_trade'} addStyle={hy} active={activeNum === i} index={i} animate={this.state.animate} pos={itm}/>
    });
    return (
      <div className='container-fluid wrapper'>
        <StatTiles SvgCB={this.props.SvgCB} tradeProps={this.props}/>
        <div className='head-line-list'>
          <strong>Past Transactions</strong>
        </div>
        <div className='row'>
          <div className='col-lg-7 col-md-6'>
            <PositionView inView={inView} viewCntrl={this.props.viewCntrl} pos={pastTrades[activeNum]}/>
          </div>
          <div className='trade-ul-list col-lg-5 col-md-6'>
            <ul id='pastTrades'>
              {pastTradeList}
            </ul>
          </div>
        </div>
      </div>
    )
  }
};
