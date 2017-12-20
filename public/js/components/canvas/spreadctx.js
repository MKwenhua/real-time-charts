import {randomFinancial} from 'd3fc-random-data';
import Canvas2DContext from 'Canvas2DContext'

const seeds = [
  {
    symb: 'AUD/JPY',
    prc: 79.013
  }, {
    symb: 'AUD/USD',
    prc: 0.7588
  }, {
    symb: 'CAD/CHF',
    prc: 0.7514
  }, {
    symb: 'CAD/JPY',
    prc: 80.757
  }, {
    symb: 'CHF/JPY',
    prc: 107.342
  }, {
    symb: 'EUR/AUD',
    prc: 1.4694
  }, {
    symb: 'EUR/CAD',
    prc: 1.44065
  }, {
    symb: 'EUR/GBP',
    prc: 0.8368
  }, {
    symb: 'EUR/JPY',
    prc: 112.89
  }, {
    symb: 'EUR/NOK',
    prc: 9.37867
  }, {
    symb: 'EUR/SEK',
    prc: 9.49165
  }, {
    symb: 'EUR/USD',
    prc: 1.1151
  }, {
    symb: 'GBP/AUD',
    prc: 1.85303
  }, {
    symb: 'GBP/CHF',
    prc: 1.2927
  }, {
    symb: 'GBP/JPY',
    prc: 138.921
  }, {
    symb: 'GBP/USD',
    prc: 1.3325
  }, {
    symb: 'USD/BRL',
    prc: 3.85397
  }, {
    symb: 'USD/CAD',
    prc: 1.31252
  }, {
    symb: 'USD/CHF',
    prc: 0.98669
  }, {
    symb: 'USD/CNY',
    prc: 6.6758
  }, {
    symb: 'USD/CZK',
    prc: 24.6089
  }, {
    symb: 'USD/HKD',
    prc: 7.7566
  }, {
    symb: 'USD/INR',
    prc: 67.0958
  }, {
    symb: 'USD/JPY',
    prc: 101.24
  }, {
    symb: 'USD/MXN',
    prc: 18.5388
  }, {
    symb: 'USD/NOK',
    prc: 8.54192
  }, {
    symb: 'USD/PLN',
    prc: 3.9742
  }, {
    symb: 'USD/RUB',
    prc: 64.745
  }, {
    symb: 'USD/SEK',
    prc: 8.64657
  }, {
    symb: 'USD/SGD',
    prc: 1.3579
  }
];

const percentChange = (last, current) => {
  if (current > last) {
    return [
      '#30b911', '+' + String(((current - last) / last) * 100).slice(0, 4) + '%'
    ];
  } else {
    return [
      '#DC143C', '-' + String(((last - current) / last) * 100).slice(0, 4) + '%'
    ]
  }
}
const spreadCTX = () => {
  const c = document.getElementById('activeSpreads');
  const ctx = Canvas2DContext(c);
  const Tickers = {
    activeSymbols: [],
    hasRendered: false
  };
  let inView = false;
  let ctxHeight = 400;
  let canRender = true;
  let typeSetting = 'spreads';
  const currentTicks = [];
  const twoDec = (val) => Math.round(val * 100) / 100;

  const renderRow = (atPos, symb, ask, bid, last, current) => {
    let textPos = atPos + 15;
    let colorNpercent = percentChange(last, current);

    ctx.clearRect(0, atPos, 200, 20)
      .font('13px Arial')
      .fillStyle('black')
      .fillRect(0, atPos, 200, 20)
      .fillStyle('silver')
      .fillRect(0, atPos + 19, 200, 1)
      .textAlign('start')
      .fillStyle('#00d8ff')
      .fillText(symb, 2, textPos)
      .textAlign('end')
      .fillStyle(colorNpercent[0])
      .fillText(colorNpercent[1], 198, textPos)
      .fillStyle('white')
      .font('12px Arial')
      .fillText(String(bid), 148, textPos - 1)
      .textAlign('start')
      .fillText(String(ask), 70, textPos - 1);
  }

  Tickers.renderLive = () => {
    Tickers.activeSymbols.forEach((symItm) => {
      setTimeout(function () {
        Tickers[symItm.s].callRound();
      }, symItm.d);
    });
  }

  Tickers.renderSpread = () => {
    canRender = false;
    ctx.clearRect(0, 0, 200, 650);
    currentTicks.forEach((itm, index) => {
      let atPos = (20 * index) + 1;
      renderRow(atPos, itm.symb, itm.ask, itm.bid, itm.last, itm.close);
    })
    Tickers.hasRendered = true;
    setTimeout(function () {
      canRender = true;
      Tickers.renderLive();
    }, 100);

  }
  Tickers.renderUnit = (topPos, utTick) => {
    if (canRender) {
      window.requestAnimationFrame(function () {
        renderRow(topPos, utTick.symb, utTick.ask, utTick.bid, utTick.last, utTick.close)
      });
    }
  }
  const newTicker = (symb, price, renderDelay) => {
    currentTicks.push({symbol: symb});
    let atDex = currentTicks.length - 1;
    let tickSymb = {
      data: [],
      currentPoint: null,
      lastPoint: null,
      change: 0.0,
      symbol: symb,
      atPos: (20 * atDex) + 1,
      tickIndex: atDex,
      startPrice: price
    };

    tickSymb.logData = (pr) => {
      let symbol = symb;
      let thisIndex = tickSymb.tickIndex;
      tickSymb.generator = randomFinancial().startDate(new Date()).startPrice(pr)
      tickSymb.stream = tickSymb.generator.stream();
      let p1s = tickSymb.stream.next();
      let p2s = tickSymb.stream.next();
      let lastpoint = {
        symb: tickSymb.symbol,
        last: 0,
        close: twoDec(p2s.close),
        ask: twoDec(p2s.high),
        bid: twoDec(p2s.low),
        askVol: p2s.volume,
        bidVol: Math.ceil(p2s.volume * (Math.random() + 0.6))
      }
      let startpoint = {
        symb: tickSymb.symbol,
        last: twoDec(p2s.close),
        close: twoDec(p1s.close),
        ask: twoDec(p1s.high),
        bid: twoDec(p1s.low),
        askVol: p1s.volume,
        bidVol: Math.ceil(p1s.volume * (Math.random() + 0.6))
      }
      tickSymb.currentPoint = startpoint;
      tickSymb.lastPoint = lastpoint;
      currentTicks[tickSymb.tickIndex] = startpoint;

      tickSymb.callRound = function () {
        if (inView) {
          let p1 = tickSymb.stream.next();
          let bidVl = Math.ceil(p1.volume * (Math.random() + 0.6));
          let point = {
            symb: symbol,
            last: tickSymb.lastPoint.close,
            close: twoDec(p1.close),
            ask: twoDec(p1.high),
            bid: twoDec(p1.low),
            askVol: p1.volume,
            bidVol: bidVl
          };
          currentTicks[thisIndex] = point;
          tickSymb.lastPoint = tickSymb.currentPoint;
          tickSymb.currentPoint = point;
          Tickers.renderUnit(tickSymb.atPos, tickSymb.currentPoint);
          setTimeout(function () {
            tickSymb.callRound();
          }, 2000);
        }

      }

    };

    tickSymb.logData.bind(tickSymb);
    Tickers[symb] = tickSymb;
    Tickers.activeSymbols.push({s: symb, d: renderDelay});

    tickSymb.logData(price);

  }

  function seedSpread() {
    seeds.forEach((itm, index) => {
      newTicker(itm.symb, itm.prc, Math.floor((Math.random() * 2000) + 10));
    });
    ctxHeight = (seeds.length * 20) + 10;

  }

  const spreadInterface = {
    renderRow: renderRow
  }
  spreadInterface.seedSpread = seedSpread.bind(spreadInterface);
  spreadInterface.inView = () => {
    inView = true;
    window.requestAnimationFrame(function () {
      Tickers.hasRendered ? Tickers.renderLive() : Tickers.renderSpread();
    });

  }
  spreadInterface.getView = () => {
    return inView;
  }
  spreadInterface.outView = () => {
    inView = false;
  }
  spreadInterface.setting = (tp) => {
    typeSetting = tp;
  }
  return spreadInterface;

}

export default spreadCTX;
