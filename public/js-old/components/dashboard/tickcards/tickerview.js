const React = require('react'); 


export default class TickerView extends React.Component {
	constructor (props) {
		
	  	super(props);
	   
		
		}

    componentDidMount () {
 
	}
	componentWillMount() {
      
 
    }
	componentWillUnmount () {
	   
	}
	render() {

    return (  
    	<div className="ticker-side-content"   >
    		<h2 className="t-side-h2">{this.props.symbol.symb}</h2>
    		<div id="tickChart" ></div>
    		<canvas id="askBidRatio" width={190} height={50}>
    		</canvas>
              </div>
    		
            )
	}
};
