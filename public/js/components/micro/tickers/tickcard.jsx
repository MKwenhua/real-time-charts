import React from 'react';

export default class TickCard extends React.PureComponent {
  constructor(props) {
    super(props);
    his.cardCTX = null;
  }
  dragStart = () => {
    this.props.dS(this.props.index);
  }
  dragEnd = () => {}
  onDragOver = (e) => {
    e.preventDefault();

  }
  mouseUp = () => {
    this.props.mU(this.props.index);
  }
  dragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.dO(this.props.index);

  };
  dragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.dL(this.props.index);

  };
  dropHandle = (e) => {
    e.preventDefault();
    this.props.dH(this.props.index);
  }
  componentDidMount() {
    let price = this.props.symbol.prc < 10 ? Math.round(this.props.symbol.prc * 100) : Math.round(this.props.symbol.prc);
    this.cardCTX = this.props.cardCtx.setCard(this.props.cardId, price, this.props.symbol.symb);
    this.cardCTX.startLoop();
  }

  render() {
    //onDragEnd={this.dragEnd}
    let clss = this.props.applyOut ? 'trade-card-holder  apply-out' : 'trade-card-holder normal-class';
    let tradeCard = this.props.active ? 'trade-card card-active' : 'trade-card';
    return (
      <div className={clss} onDragOver={this.dragEnter} onMouseUp={this.mouseUp} style={{
        animation: this.props.ani
      }} onDrop={this.dropHandle}>
        <div className={tradeCard} draggable='true' onDragStart={this.dragStart}>
          <p className='span-label-blue symb-label'>{this.props.symbol.symb}</p>
          <canvas id={this.props.cardId} className='canvasTick' width={210} height={60}></canvas>
        </div>
      </div>
    )
  }
};
