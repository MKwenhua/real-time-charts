const React = require('react');
const mF = require('../../helpers/mathfuncs.js');
const calcX = (number) => {
 return  11+ (-11 * mF.getDigitLen(number) );
}
const animateStat = () => {
	
}

export default class Stat extends React.Component {
    constructor(props) {
      super(props);
      this.svg = null;
     
    };
	componentDidMount () {
    console.log('stat props', this.props);
    let theSVG =  document.getElementById(this.props.svgId).querySelector('TEXT');
    this.svg = theSVG;
    this.props.SvgCB.setRef(this.props.svgId , Object.assign({} , this.props.config, {domElem: theSVG }));   
    
	}
  componentWillMount () {
    
  }
  render() { 
    let {classType, number } = this.props; 
    return (    
    	  <div className="count count-47">
           <svg id={this.props.svgId} className="svg-container" height="40" width="22">
              <text className={classType} x="11" y="35" fill={this.props.fillColor}></text>
            </svg>
        </div>
     )
	}
};