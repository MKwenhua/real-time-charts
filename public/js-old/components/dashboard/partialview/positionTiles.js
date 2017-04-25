const React = require('react'); 

export default class PositionTile extends React.Component {
	constructor (props) {
	  	super(props);
	  	  
		 
		
		}
    componentDidMount () {
    	this.props.posTileCTX.setTile(this.props.pos, this.props.pos.ctxid);
	}
	componentWillMount() {
      

    }
	componentWillUnmount () {
	 
	}
	render() {
		let {pos} = this.props;
		let cl = pos.type === "CALL" ? "pos-block pos-call" : "pos-block pos-put";
		
    return (  
    	<li className={cl} >
				<div className="span-label-blue th-span div-symb-hold">{pos.symb}</div>
				<div>{pos.qty}</div>
				 <canvas id={pos.ctxid} width="100" height="30"></canvas>
			</li>
              
              
            )
	}
};
