import React from "react";

export default class TickCard extends React.PureComponent {
	constructor (props) {
	  super(props);
	  this.cardCTX = null;
	}
	dragStart = () => this.props.cardDragStart(this.props.index);
	onDragOver = (e) => e.preventDefault()
	mouseUp = () => this.props.cardPostionClick(this.props.index);
	dragEnter = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.dragOverCard(this.props.index);
	}
	dragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		this.props.dragLeftCard(this.props.index);

	}
	dropHandle = (e) => {
		e.preventDefault();
		this.props.cardDropped(this.props.index);
	}
  componentDidMount () {
     let price = this.props.symbol.prc < 10 ? Math.round(this.props.symbol.prc * 100) : Math.round(this.props.symbol.prc);
     this.cardCTX = this.props.cardCtx.setCard(this.props.cardId, price, this.props.symbol.symb);
     this.cardCTX.startLoop();
	}
	render() {
		const { applyOut, active } = this.props;
    return (
    	<div
				className={applyOut ? "trade-card-holder  apply-out" : "trade-card-holder normal-class"}
				onDragOver={this.dragEnter}
				onMouseUp={this.mouseUp}
				style={{animation: this.props.animation}}
				onDrop={this.dropHandle} >
     		<div className={ active ? "trade-card card-active" : "trade-card" }
						draggable="true"
						onDragStart={this.dragStart} >
    			<p className="span-label-blue symb-label">{this.props.symbol.symb}</p>
          	<canvas id={this.props.cardId} className="canvasTick" width={210} height={60}></canvas>
        </div>
      </div>
    )
	}
};
