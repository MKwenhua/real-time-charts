import Canvas2DContext from 'Canvas2DContext'

const CurrentPositions = () => {
  let inView = true;
  const upTriangle = (ctx) => {
    ctx.beginPath()
      .strokeStyle('#00FF00')
      .fillStyle('#00FF00')
      .moveTo(5, 12)
      .lineTo(0, 18)
      .lineTo(10, 18)
      .lineTo(5, 12)
      .stroke()
      .fill();
  }

  const downTriangle = (ctx) => {
    ctx.beginPath()
      .strokeStyle('#FF2500')
      .fillStyle('#FF2500')
      .moveTo(5, 18)
      .lineTo(0, 12)
      .lineTo(10, 12)
      .lineTo(5, 18)
      .stroke()
      .fill();
  }
  const percentChnge = (last, current) => {
    let sign = (current > last) ? '+' : '-';
    return [
      (current > last),
      sign + String(Math.abs((current - last) / last) * 100).slice(0, 4) + '%'
    ];
  }

  const getTimeLeft = (d) => d < 0 ? 'Ended' : parseInt(d / 60, 10) + ':' + ('0' + parseInt(d % 60, 10)).slice(-2);

  const renderArrow = (upArrow, ctx) => upArrow === true ? upTriangle(ctx) : downTriangle(ctx);
  function startTimer(duration, ctx, prc, current) {
    const change = percentChnge(prc, current);
    const timeLeft = getTimeLeft(duration)

    ctx.clearRect(0, 0, 100, 30)
      .textAlign('end')
      .font('15px Arial')
      .strokeStyle('white')
      .fillStyle('white')
      .fillText(timeLeft, 98, 20)
      .textAlign('start')
      .font('12px Arial')
      .fillText(change[1], 15, 20);

      renderArrow(change[0], ctx);
  }

  function PostionTile(position, ctxId) {
    const c = document.getElementById(ctxId);
    const ctx = Canvas2DContext(c);

    this.position = position;
    this.expireTime = position.timestamp.getTime();
    this.setTimer = () => {
      let nowTime = new Date().getTime();
      if (inView) {
        let current = this.position.getLatestPoint();

        window.requestAnimationFrame(() => {
          startTimer(((this.expireTime - nowTime) / 1000), ctx, this.position.unitPrice, current.data[3])
        });
      }

      if (this.expireTime > nowTime) {
        setTimeout(() => this.setTimer(), 1000);
      }
    }
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

const PositionTiles = CurrentPositions();

export default PositionTiles;
