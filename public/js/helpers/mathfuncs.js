
const MathFuncs = {
   getDigitLen: (num) => (Math.log(Math.abs(num)) * Math.LOG10E + 1 | 0),
   niceFloats: (num) => {
   	  const res = num / 1000;
   	  if (res < 10){
   	  	return num.toFixed(2);
   	  }
   	  if (res < 100) {
   	  	return (res).toFixed(3) + 'k';
   	  }
   	  if (res < 1000){
   	  	return (res).toFixed(2) + 'k';
   	  }
   	  if (res < 10000) {
   	  	return (res).toFixed(3) + 'm';
   	  }
   	   if (res < 100000) {
   	  	return (res).toFixed(2) + 'm';
   	  }
   	  return num;
   }
};

export default MathFuncs;
