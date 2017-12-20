//import CanvasJS from '../canvas.js';
const CtxChart = (symbl) => {
   const chartSettings = {
      cT: "candlestick",
      setType: 0,
      types: ['area', 'line', 'candlestick', 'ohlc']
   }
   let dataFull = false;
   let inView = true;
   const mainSymbol = symbl;
   const dataPoints = {}
   const aX = {
      //  interval: 5,
      //  intervalType: "second",
      labelFontSize: 10,
      margin: 20,
      valueFormatString: "HH:mm:ss",
      lineThickness: 1
   };

   const aY = {
      minimum: 99999,
      labelFontSize: 14,
      gridThickness: 0.5,
      gridColor: "#224458",
      lineThickness: 1
   }
   const setAxMinMax = (x) => {
      aX.minimum = x;
      aX.maximum = new Date(x.getTime() + chartSettings.setBack);
   }
   const setAxMinMax2 = (len) => {
      let diff = chartSettings.dataLength - len;
      if (diff > 0) {
         // let x = dataPoints[mainSymbol][0].x;
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
         //   aX.interval = 5;
         chartSettings.setType = 1;
         chartSettings.dataLength = 600;
         chartSettings.setBack = 60000;
         return {type: 'area', markerSize: 0, cursor: "pointer", axisYType: "secondary", fillOpacity: .3}
      },
      line: () => {
         // aX.interval = 5;
         chartSettings.setType = 1;
         chartSettings.dataLength = 600;
         chartSettings.setBack = 60000;
         return {type: 'line', markerSize: 0, cursor: "pointer", axisYType: "secondary"}
      },
      ohlc: () => {
         //  aX.interval = 2;
         // dataPoints[mainSymbol] = []
         chartSettings.setType = 0;
         chartSettings.dataLength = 120;
         chartSettings.setBack = 12000;
         return {
            type: "ohlc",
            markerSize: 0,
            fillOpacity: 1,
            cursor: "pointer",
            risingColor: "#00FF00",
            axisYType: "secondary"

         }
      },
      candlestick: () => {
         //   aX.interval = 2;
         dataPoints[mainSymbol] = []
         chartSettings.setType = 0;
         chartSettings.dataLength = 120;
         chartSettings.setBack = 12000;
         return {
            type: "candlestick",
            markerSize: 0,
            fillOpacity: 1,
            cursor: "pointer",
            risingColor: "#00FF00",
            axisYType: "secondary"

         }
      }

   }

   const makeSeries = (type, symbol) => {
      dataPoints[symbol] = [];
      //console.log('dataPoints', dataPoints);
      let chartConfig = chartConfigs[type]();
      chartConfig.dataPoints = dataPoints[symbol];
      return chartConfig;
   }
   const series = [];
   series.push(makeSeries(chartSettings.cT, mainSymbol));

   let chart = new CanvasJS.Chart(mainSymbol, {
      title: {
         text: symbl,
         fontColor: "#00d8ff",
         fontSize: 20,
         verticalAlign: "top",
         horizontalAlign: "left"
      },
      axisX: aX,
      axisY2: aY,
      backgroundColor: "#18252e",
      data: series
   });
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
         // setAxMinMax2(dataPoints[mainSymbol].length);
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
      let xVal = new Date();
      let lnColor = point.lastVal < point.data[3] ? "#1294ff" : "#ee5c5c";
      let data = {
         x: xVal,
         y: point.data[3],
         lineColor: lnColor
      };

      aY.minimum = aY.minimum > point.min ? Math.floor(point.min) : aY.minimum;
      //	 if (!aX.viewportMinimum) { setAxMinMax(xVal) }

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

         aX.maximum = new Date(xVal.getTime() + 200);
         dataFull = true;

         dataPoints[point.symb].shift();

         aX.minimum = dataPoints[point.symb][0].x
      }
      if (inView) {
         chart.render();
      }
   };
   const ohlcCharts = (point) => {
      let xVal = new Date();
      let data = {
         x: xVal,
         y: point.data
      };
      aY.minimum = aY.minimum > point.min ? Math.floor(point.min) : aY.minimum;

      if (!aX.maximum) {
         if (dataPoints[point.symb].length > 0) {
            setAxMinMax(xVal)

         } else {
            setAxMinMax(xVal)
         }
      }
      dataPoints[point.symb].push(data);
      if (dataPoints[point.symb].length > chartSettings.dataLength) {
         aX.maximum = new Date(xVal.getTime() + 200);
         dataFull = true;

         dataPoints[point.symb].shift();
         aX.minimum = dataPoints[point.symb][0].x;

      }
      if (inView) {
         chart.render();
      }
   };
   return {
      dataStream: (point) => {

         if (chartSettings.cT === 'area' || chartSettings.cT === 'line') {
            lineCharts(point);
         }
         if (chartSettings.cT === 'candlestick' || chartSettings.cT === 'ohlc') {
            ohlcCharts(point);
         }

      },
      addSeries: (sym) => {
         series.push(makeSeries('line', sym));
         console.log('series', series);
      },
      removeSeries: (sym) => {
         console.log('removeSeries')
      }
      chartType : (type) => {

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

module.exports = CtxChart;
