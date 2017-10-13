import Canvas2DContext from 'Canvas2DContext'
const CurrentPositions = () => {
  let inView = true;
  const upTriangle = (ctx) => {
    ctx.beginPath().strokeStyle('#00FF00').fillStyle('#00FF00').moveTo(5, 12).lineTo(0, 18).lineTo(10, 18).lineTo(5, 12).stroke().fill();
  }
  const downTriangle = (ctx) => {
    ctx.beginPath().strokeStyle('#FF2500').fillStyle('#FF2500').moveTo(5, 18).lineTo(0, 12).lineTo(10, 12).lineTo(5, 18).stroke().fill();

  }
  const percentChnge = (last, current) => {
    let sign = (current > last) ? '+' : '-';
    return [
      (current > last),
      sign + String(Math.abs((current - last) / last) * 100).slice(0, 4) + '%'
    ];
  }
  function startTimer(duration, ctx, prc, current) {
    let change = percentChnge(prc, current);
    let timeLeft = parseInt(duration / 60, 10) + ':' + ('0' + parseInt(duration % 60, 10)).slice(-2);

    timeLeft = duration < 0 ? 'Ended' : timeLeft;

    ctx.clearRect(0, 0, 100, 30).textAlign('end').font('15px Arial').strokeStyle('white').fillStyle('white').fillText(timeLeft, 98, 20).textAlign('start').font('12px Arial').fillText(change[1], 15, 20);
    change[0] ? upTriangle(ctx) : downTriangle(ctx);
  }

  function PostionTile(position, ctxId) {
    const c = document.getElementById(ctxId);
    let ctx = Canvas2DContext(c);

    this.position = position;
    this.expireTime = position.timestamp.getTime();
    let thisScope = this;
    const setTimer = () => {
      let nowTime = new Date().getTime();
      if (inView) {
        let current = this.position.getLatestPoint();

        window.requestAnimationFrame(function () {
          startTimer(((thisScope.expireTime - nowTime) / 1000), ctx, thisScope.position.unitPrice, current.data[3])
        });
      }

      if (thisScope.expireTime > nowTime) {
        setTimeout(function () {
          thisScope.setTimer();
        }, 1000);
      }
    }
    this.setTimer = setTimer.bind(this);
    this.setTimer();
  }
  return {
    setTile: (position, ctxId) => {
      return new PostionTile(position, ctxId);
    },
    inView: () => {
      inView = true;

    },
    getView: () => {
      return inView;
    },
    outView: () => {
      inView = false;
    }
  }
}
module.exports = CurrentPositions();
