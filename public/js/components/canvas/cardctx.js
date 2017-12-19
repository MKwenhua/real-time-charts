import {randomFinancial} from 'd3fc-random-data';
import Canvas2DContext from 'Canvas2DContext'

const areaChartConfig = (data) => ({
  axisX: {
    valueFormatString: ' ',
    tickLength: 0,
    margin: -3,
    lineThickness: 1
  },
  axisY: {
    valueFormatString: ' ',
    gridThickness: 0.3,
    includeZero: false,
    tickLength: 0.5,
    margin: -5,
    gridColor: '#224458',
    lineThickness: 1
  },
  interactivityEnabled: false,
  backgroundColor: '#18252e',
  width: 190,
  height: 170,
  animationEnabled: false,
  markerType: 'none',
  data: data
})

const generateData = (pr) => (
  randomFinancial()
  .startDate(new Date())
  .startPrice(pr)(30)
  .map((itm, i) => ({x: i, y: itm.close}))
);

const CardCtx = () => {
  let inView = true;
  const callAll = [];

  const chartView = {
    symb: null,
    config: null,
    chart: null,
    ii: 0,
    priceSeed: null,
    data: [
      {
        type: 'area',
        markerType: 'none',
        fillOpacity: 0.3,
        lineColor: 'white',
        color: '#00FF00',
        dataPoints: []
      }
    ],
    render: function () {
      if (!this.data[0].dataPoints.length) {
        this.data[0].dataPoints = generateData(this.priceSeed);
      }
      this.config = areaChartConfig(this.data);
      this.ii = 29;
      this.chart = new CanvasJS.Chart('tickChart', this.config);
      this.chart.render();
    },
    newSet: function (symbol, price) {
      this.symb = symbol;
      this.priceSeed = price;
      this.data[0].dataPoints = generateData(this.priceSeed);
      this.ii = 29;
      this.config.data = this.data;
      this.chart.render();
    },
    update: function (newPnt) {
      this.data[0].dataPoints.shift();
      this.ii += 1;
      this.data[0].dataPoints.push({x: this.ii, y: newPnt.close});
      this.config.data = this.data;
      this.chart.render();
    }

  };
  const askBid = {}
  const upTriangle = (ctx, prnChng) => {
    ctx.beginPath()
    .strokeStyle('#00FF00')
    .fillStyle('#00FF00')
    .moveTo(105, 35)
    .lineTo(97, 41)
    .lineTo(113, 41)
    .lineTo(105, 35)
    .stroke()
    .fill()
    .font('bold 13px Arial')
    .textAlign('center')
    .fillText(prnChng, 105, 30);
  }
  const downTriangle = (ctx, prnChng) => {
    ctx.beginPath()
    .strokeStyle('#FF2500')
    .fillStyle('#FF2500')
    .moveTo(105, 41)
    .lineTo(97, 35)
    .lineTo(113, 35)
    .lineTo(105, 41)
    .stroke()
    .fill()
    .font('bold 13px Arial')
    .textAlign('center')
    .fillText(prnChng, 105, 30);
  }

  const percentChange = (ctx, last, current) => {
    if (current > last) {
      upTriangle(ctx, '+' + String(((current - last) / last) * 100).slice(0, 4) + '%');
    } else {
      downTriangle(ctx, '-' + String(((last - current) / last) * 100).slice(0, 4) + '%');
    }
  }

  const renderChange = (ctx, last, current, call, put) => {
    let diff = (call >= 100 || put >= 100) ? 20 : 0;
    ctx.clearRect(0, 0, 210, 60)
    .font('45px Arial')
    .textAlign('end')
    .fillStyle('white')
    .fillText(Math.floor(put), 75, 50)
    .textAlign('start')
    .fillText(Math.ceil(call), 135, 50)
    .font('11px Arial')
    .fillText('ASK', (150 + diff), 10)
    .textAlign('end')
    .fillText('BID', (66 - diff), 10);
    percentChange(ctx, last, current);

  }
  const setCard = (cardId, price = 88, symb) => {
    const c = document.getElementById(cardId);
    const ctx = Canvas2DContext(c);
    let pointStream = randomFinancial().startDate(new Date()).startPrice(price).stream();
    let last = pointStream.next();

    const start = () => {
      let current = pointStream.next();

      window.requestAnimationFrame(function () {
        renderChange(ctx, last.close, current.close, current.high, current.low);
        last = current;
        if (chartView.symb === symb && false) {
          chartView.update(current);
        }
      });
    }

    const startLoop = () => {
      window.requestAnimationFrame(start);

      setTimeout(function () {
        if (inView === true) {
          window.requestAnimationFrame(startLoop);
        }
      }, 1500);
    }
    callAll.push(startLoop.bind(this));

    const thisCard = {
      start: () => {
        let current = pointStream.next();

        window.requestAnimationFrame(function () {
          renderChange(ctx, last.close, current.close, current.high, current.low);
        });

        setTimeout(startLoop, 1500);

      },
      startLoop: startLoop
    };

    return thisCard;

  }
  return {
    setCard: setCard,
    chartView: chartView,
    inView: () => {
      inView = true;
      callAll.forEach((itm) => {
        let tO = Math.floor((Math.random() * 1500) + 10)
        setTimeout(itm, tO);
      });

    },
    getView: () => {
      return inView;
    },
    outView: () => {
      inView = false;
    }
  }
}

export default CardCtx;
