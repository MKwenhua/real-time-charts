import Canvas2DContext from 'Canvas2DContext'

const totalAmountCtx = (cash) => {
  const startAmt = '$' + cash;
  const c = document.getElementById('totalAccount');
  const ctx = Canvas2DContext(c);
  ctx.font('23px sans-serif').textAlign('end').fillStyle('#30d94c').fillText(startAmt, 98, 28);
  const ctxFill = (amt, ii, unit) => {
    let tO = ii * unit;
    setTimeout(function () {
      window.requestAnimationFrame(function () {
        ctx.clearRect(0, 0, 100, 40).fillStyle(amt.color).fillText(amt.text, 98, 28);
      });
    }, tO);
  };
  const showDiff = (ogValue, newValue) => {
    let values = [];
    let ogCPY = ogValue;
    let unit = Math.ceil((1 / Math.abs(ogValue - newValue)) * 1000);
    let newVl = Math.floor(newValue);
    if (ogValue > newValue) {
      while (ogCPY > newVl) {
        ogCPY -= 1;
        values.push({
          text: '$' + ogCPY,
          color: ogCPY > 0 ? '#30d94c' : 'red'
        });
      }
    } else {
      while (ogCPY < newVl) {
        ogCPY += 1;

        values.push({
          text: '$' + ogCPY,
          color: ogCPY > 0 ? '#30d94c' : 'red'
        });
      }
    }
    values.forEach((itm, i) => {
      ctxFill(itm, i, unit);
    });

  };

  window.showDiff = showDiff;
};

export default totalAmountCtx;
