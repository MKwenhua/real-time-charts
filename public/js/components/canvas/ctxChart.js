const trendLineCreate = require('canvas/trendlineCTX.js');

const lineDataTransform = (data, ln) => data.map((itm, i) => (
  {x: itm.data.x, y: itm.data.y[3], lineColor: itm.lineColor}
))

const ohlcDataTransform = (data, ln) => data.slice(-ln).map((itm, i) => (
  {x: itm.data.x, y: itm.data.y}
))


function CtxController() {
  let inView = true;
  this.outOfView = () => {
    inView = false;
  };
  this.backInView = () => {
    inView = true;
  };

  const CtxChrt = (symbl) => {
    const chartSettings = {
      cT: 'candlestick',
      setType: 0,
      types: ['area', 'line', 'candlestick', 'ohlc']
    }
    let dataFull = false;
    let lastXval = null;
    const TrendLine = trendLineCreate(symbl + '_trend');
    const fullDataPoints = [];
    const mainSymbol = symbl;
    const dataPoints = {}
    const aX = {
      labelFontSize: 10,
      margin: 20,
      valueFormatString: 'HH:mm:ss',
      lineThickness: 1
    };

    const aY = {
      minimum: 99999,
      labelFontSize: 14,
      gridThickness: 0.5,
      gridColor: '#224458',
      lineThickness: 1
    }
    const setAxMinMax = (x) => {
      aX.minimum = x;
      aX.maximum = new Date(x.getTime() + chartSettings.setBack + 400);
    }
    const setAxMinMax2 = (len) => {
      let diff = chartSettings.dataLength - len;
      if (diff > 0) {
        let x = dataPoints[mainSymbol][1].x;
        aX.viewportMinimum = x;
        aX.minimum = x;
        aX.viewportMaximum = new Date(x.getTime() + (diff * 100));
        aX.maximum = aX.viewportMaximum;
        dataFull = false;
      }
      // aX.maximum = new Date(dataPoints[mainSymbol][0].x.getTime() + chartSettings.setBack);
    }
    const chartConfigs = {
      area: () => {
        chartSettings.setType = 1;
        chartSettings.dataLength = 594;
        chartSettings.setBack = 120000;
        return {type: 'area', markerSize: 0, cursor: 'pointer', axisYType: 'secondary', fillOpacity: .3}
      },
      line: () => {
        chartSettings.setType = 1;
        chartSettings.dataLength = 594;
        chartSettings.setBack = 120000;
        return {type: 'line', markerSize: 0, cursor: 'pointer', axisYType: 'secondary'}
      },
      ohlc: () => {
        chartSettings.setType = 0;
        chartSettings.dataLength = 130;
        chartSettings.setBack = 27000;
        return {
          type: 'ohlc',
          markerSize: 0,
          fillOpacity: 1,
          cursor: 'pointer',
          risingColor: '#00FF00',
          axisYType: 'secondary'

        }
      },
      candlestick: () => {
        //   aX.interval = 2;
        dataPoints[mainSymbol] = []
        chartSettings.setType = 0;
        chartSettings.dataLength = 130;
        chartSettings.setBack = 27000;
        return {
          type: 'candlestick',
          markerSize: 0,
          fillOpacity: 1,
          cursor: 'pointer',
          risingColor: '#00FF00',
          axisYType: 'secondary'

        }
      }

    }

    const makeSeries = (type, symbol) => {
      dataPoints[symbol] = [];
      let chartConfig = chartConfigs[type]();
      chartConfig.dataPoints = dataPoints[symbol];
      return chartConfig;
    }
    const series = [];
    series.push(makeSeries(chartSettings.cT, mainSymbol));

    let chart = new CanvasJS.Chart(mainSymbol, {
      title: {
        text: symbl,
        fontColor: '#00d8ff',
        fontSize: 20,
        verticalAlign: 'top',
        horizontalAlign: 'left'
      },
      toolTip: {
        enabled: true,
        animationEnabled: false
      },
      axisX: aX,
      axisY2: aY,
      backgroundColor: '#18252e',
      data: series
    });
    chart.setTrendLineCB(TrendLine.lineShift, TrendLine.callPutLines);
    chart.rectBsetColor = '#000000';
    const modifySeries = (type) => {
      let chartConfig = chartConfigs[type]();
      let tyChange = {
        line: 1,
        area: 1,
        ohlc: 0,
        candlestick: 0
      }
      chartSettings.cT = type;
      if (tyChange[type] !== chartSettings.setType) {
        if (chartSettings.dataLength < dataPoints[mainSymbol].length) {
          let sliceTo = chartSettings.dataLength * -1;
          let a1 = dataPoints[mainSymbol].slice(sliceTo);
          dataPoints[mainSymbol] = a1;
          chartConfig.dataPoints = a1;
        }
      }
      delete aX.maximum;
      delete aX.minimum;
      chartConfig.dataPoints = dataPoints[mainSymbol];
      series[0] = chartConfig;

    }

    const lineCharts = (point) => {
      let xVal = new Date(lastXval.getTime() + 200);
      lastXval = xVal;
      let lnColor = point.lastVal < point.data[3] ? '#1294ff' : '#ee5c5c';
      let data = {
        x: xVal,
        y: point.data[3],
        lineColor: lnColor
      };
      aY.minimum = aY.minimum > point.min ? Math.floor(point.min) : aY.minimum;

      if (!aX.maximum) {
        //  if (dataPoints[point.symb].length === 0){
        setAxMinMax(xVal)
        // }else{
        //setAxMinMax(dataPoints[point.symb][1].x, false)
        setAxMinMax(xVal)
        //}
      }
      dataPoints[point.symb].push(data);

      if (dataPoints[point.symb].length > chartSettings.dataLength) {

        aX.maximum = new Date(xVal.getTime() + 1200);
        dataFull = true;

        dataPoints[point.symb].shift();
        //fullDataPoints.shift();

        aX.minimum = dataPoints[point.symb][0].x
      }
      if (inView) {
        chart.render();

        //  TrendLine(chart.getLastXY());
      }
    };
    const ohlcCharts = (point) => {
      let xVal = new Date(lastXval.getTime() + 200);
      lastXval = xVal;
      let data = {
        x: xVal,
        y: point.data
      };
      aY.minimum = aY.minimum > point.min ? Math.floor((point.min * 0.975)) : aY.minimum;

      if (!aX.maximum) {
        if (dataPoints[point.symb].length > 0) {
          setAxMinMax(xVal)

        } else {
          setAxMinMax(xVal)
        }
      }
      dataPoints[point.symb].push(data);
      // fullDataPoints.push({data:data, lineColor: point.lastVal < point.data[3] ? '#1294ff' : '#ee5c5c'});
      if (dataPoints[point.symb].length > chartSettings.dataLength) {
        aX.maximum = new Date(xVal.getTime() + 1200);
        dataFull = true;

        dataPoints[point.symb].shift();
        // fullDataPoints.shift();
        aX.minimum = dataPoints[point.symb][0].x;

      }
      if (inView) {
        chart.render();

        // TrendLine(chart.getLastXY());
      }
    };
    let lastPoint = null;

    return {

      dataStream: (point) => {
        lastPoint = point;
        if (point.data[2] < 1) {
          point.data[0] *= 1000;
          point.data[1] *= 1000;
          point.data[2] *= 1000;
          point.data[3] *= 1000;
          point.min *= 1000;
          point.lastVal *= 1000;
        }

        if (!lastXval) {
          lastXval = new Date(new Date().getTime() - 200);

        }
        if (chartSettings.cT === 'area' || chartSettings.cT === 'line') {
          lineCharts(point);
        }
        if (chartSettings.cT === 'candlestick' || chartSettings.cT === 'ohlc') {
          ohlcCharts(point);
        }

      },
      changeRectColor: (color) => {

        chart.rectBsetColor = color;
      },
      useSolids: () => {
        chart.rectBset = false;
      },
      addSeries: (sym) => {
        series.push(makeSeries('line', sym));
        console.log('series', series);
      },
      getLatestPoint: () => {
        return lastPoint;
      },
      addNewPos: (pos) => {
        TrendLine.newPos(pos);
      },
      getTrendLineCntrl: () => {},
      posExpired: (pos) => {
        TrendLine.posExpired(pos.timestamp);
      },
      removeSeries: (sym) => {
        console.log('removeSeries')
      },
      getChartType: () => {
        return chartSettings.cT;
      },
      chartType: (type) => {

        chartSettings.cT = type;
        modifySeries(type);
      },
      changeDataLength: (len) => {
        dataLength = len > 150 ? len : 150;
      },
      shutdown: () => {
        console.log('the component unmounted');
      }

    }

  }
  this.passCTXconstructor = () => {
    return CtxChrt;
  }
}

const CtxChart = new CtxController();

export default CtxChart;
