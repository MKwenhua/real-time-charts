const mF = require('../helpers/mathfuncs.js');


const statSVGs = () => {
   const calcX = (number, buffer = 11) => {
      return buffer + (-11 * mF.getDigitLen(number));
   }



   function SvgCallBacks() {};

   const SvgCB = new SvgCallBacks();
   SvgCB.inViewBool = false;
   SvgCB.shouldAnimate = true;
   SvgCB.svg1 = null;
   SvgCB.svg2 = null;
   SvgCB.svg3 = null;
   SvgCB.svg4 = null;
   SvgCB.svg5 = null;
   SvgCB.svgRepeat = (svgElm, itm, ii, unit, fillChng) => {
      let tO = ii * unit;
      setTimeout(function() {
         window.requestAnimationFrame(function() {
            svgElm.setAttribute('x', itm.xVal);
            if (fillChng) {
               svgElm.setAttribute('fill', itm.fill);
            }
            svgElm.textContent = itm.text;
         });
      }, tO);


   };
   SvgCB.setRef = (svgId, config) => {
      SvgCB[svgId] = config;
   }

   SvgCB.svgAnimate = (ogValue, newValue, svgOb) => {

      let buffer = svgOb.buffer;
      let plusValue = svgOb.plusValue;
      let values = [];
      let inc = svgOb.type === "float" ? 100 : 1;
      let ogCPY = Math.round(ogValue * inc);
      let newVl = Math.round(newValue * inc);
      let diff = Math.abs(ogCPY - newVl);
      let unit = diff > 1000 ? 16 : Math.ceil((1 / diff) * 500);
      let sub = diff > 1000 ? Math.ceil(diff / 60) : (diff / inc > 10 ? inc : 1);
      if (ogValue > newValue) {
         while (ogCPY > newVl) {
            ogCPY -= sub;
            let numString = svgOb.type === "float" ? mF.niceFloats(ogCPY / inc) : ogCPY;
            let xx = svgOb.type === "float" ? -11 * (numString.length - 1) : calcX(ogCPY, 11);
            // let measureNum = svgOb.type === "float" ?  Math.round(ogCPY * 100) : ogCpy;
            //let txtNum = svgOb.type === "float" ? (measureNum/100) : ogCpy;
            values.push({
               text: numString,
               fill: ogCPY === 0 ? "#73879C" : (ogCPY > 0 ? "#30d94c" : "#DC143C"),
               xVal: xx
            });
         }
      } else {
         while (ogCPY < newVl) {
            ogCPY += sub;
            let numString = svgOb.type === "float" ? mF.niceFloats(ogCPY / inc) : ogCPY;
            let xx = svgOb.type === "float" ? -11 * (numString.length - 1) : calcX(ogCPY, -1);
            //let measureNum = svgOb.type === "float" ?  Math.round(ogCPY * 100) : ogCpy;
            //let txtNum = svgOb.type === "float" ? (measureNum/100) : ogCpy;
            values.push({
               text: numString,
               fill: ogCPY === 0 ? "#73879C" : (ogCPY > 0 ? "#30d94c" : "#DC143C"),
               xVal: xx
            });
         }
      }
      // console.log('values', values);
      values.forEach((itm, i) => {
         SvgCB.svgRepeat(svgOb.domElem, itm, i, unit, svgOb.fillChange);
      });

   }
   SvgCB.inView = () => {
      console.log('SvgCB', SvgCB);
      SvgCB.inViewBool = true;

      setTimeout(function() {
         ['svg1', 'svg2', 'svg3', 'svg4', 'svg5'].forEach((itm) => {
            if (!SvgCB[itm]) return false;

            let cuSVG = SvgCB[itm];
            if (cuSVG.animate) {
               SvgCB.svgAnimate(cuSVG.lastValue, cuSVG.current, cuSVG);
               cuSVG.animate = false;
            }
         });


      }, 150);

   };




   SvgCB.upDate = (pastTrades, totalRev) => {
      if (!SvgCB.svg1) return '';

      SvgCB.svg1.lastValue = SvgCB.svg1.current;
      SvgCB.svg1.animate = true;
      SvgCB.svg1.current += 1;
      SvgCB.svg2.lastValue = SvgCB.svg2.current;
      SvgCB.svg2.animate = true;
      SvgCB.svg2.current = totalRev;
      SvgCB.svg3.lastValue = SvgCB.svg3.current;
      SvgCB.svg3.animate = true;
      SvgCB.svg3.current = SvgCB.svg3.current + (SvgCB.svg2.current - SvgCB.svg2.lastValue);
      SvgCB.svg4.lastValue = SvgCB.svg4.current;
      SvgCB.svg4.animate = true;
      SvgCB.svg4.current += (Math.round(pastTrades[0].profit * 100) / 100);
      SvgCB.svg5.lastValue = SvgCB.svg5.current
      SvgCB.svg5.animate = true;
      SvgCB.svg5.current += pastTrades[0].volume;
      if (SvgCB.inViewBool) {
         ['svg1', 'svg2', 'svg3', 'svg4', 'svg5'].forEach((itm) => {
            if (!SvgCB[itm]) return false;

            let cuSVG = SvgCB[itm];
            if (cuSVG.animate) {
               SvgCB.svgAnimate(cuSVG.lastValue, cuSVG.current, cuSVG);
            }
         });
      }
   }
   return SvgCB;

};
module.exports = statSVGs;