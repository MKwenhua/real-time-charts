import React from 'react';
import MathFuncs from 'helper/mathfuncs';
const calcX = (number) => {
   return 11 + (-11 * MathFuncs.getDigitLen(number));
}
const animateStat = () => {}

export default class Stat extends React.PureComponent {
   constructor(props) {
      super(props);
      this.svg = null;

   };
   componentDidMount() {
      let { svgId, SvgCB, config  } = this.props
      let theSVG = document.getElementById(svgId).querySelector('text');
      this.svg = theSVG;
      SvgCB.setRef(svgId, Object.assign({}, config, {domElem: theSVG}));
   }
   componentWillMount() {}
   render() {
      let {classType, number, svgId, fillColor} = this.props;
      return (
         <div className='count count-47'>
            <svg id={svgId} className='svg-container' height='40' width='22'>
               <text className={classType} x='11' y='35' fill={fillColor}></text>
            </svg>
         </div>
      )
   }
};
