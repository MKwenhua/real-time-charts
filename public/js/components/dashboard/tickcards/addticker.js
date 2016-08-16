const React = require('react'); 


export default class AddTicker extends React.Component {
	constructor (props) {
	  	super(props);
	  	

		this.dragEnter = this.dragEnter.bind(this);
		this.dragLeave = this.dragLeave.bind(this);
		this.dropHandle = this.dropHandle.bind(this);
		
		}
	dragStart () {

	 this.props.dS(this.props.index);
	}
	dragEnd () {
	
	}
	onDragOver (e) {
		e.preventDefault();
		
	}
	dragEnter (e) {
		e.preventDefault();e.stopPropagation();
		

	};
	dragLeave (e) {
		e.preventDefault();e.stopPropagation();
		
	
	};
	dropHandle (e) {
		e.preventDefault();
		this.props.dH(this.props.index);
	}
    componentDidMount () {
  
	}
	componentWillMount() {
      

    }
	componentWillUnmount () {
	   
	}
	render() {

    return (  
    	<div className={  this.props.actionClass } onDragLeave={this.dragLeave.bind(this)} onDragOver={this.dragEnter.bind(this)} onDrop={this.dropHandle.bind(this)} >
     	<div className="trade-card" draggable="true" onDragStart={this.dragStart.bind(this)} >
    			 <p className="span-label-blue symb-label">{this.props.symbol}</p>
          		 <canvas id={this.props.cardId} width={90} height={60}></canvas>
              </div>
              </div>
            )
	}
};
