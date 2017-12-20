const candlestickConfig = (symbol, data) => {
   let name = symbol + ' Stock Price';
   return {
      rangeSelector: {
         selected: 1
      },

      title: {
         text: name
      },
      series: [
         {
            type: 'candlestick',
            name: name,
            data: data,
            dataGrouping: {
               units: [
                  ['week', [1]
                  ],
                  [
                     'month',
                     [1, 2, 3, 4, 6]
                  ]
               ]
            }
         }
      ]
   };
};
const ohlcConfig = (symbol, data) => {
   let name = symbol + ' Stock Price';
   return {
      rangeSelector: {
         selected: 1
      },

      title: {
         text: name
      },
      series: [
         {
            type: 'ohlc',
            name: name,
            data: data,
            dataGrouping: {
               units: [
                  ['week', [1]
                  ],
                  [
                     'month',
                     [1, 2, 3, 4, 6]
                  ]
               ]
            }
         }
      ]
   };
};
const columnConfig = (symbol, data) => {
   let name = symbol + ' Stock Volume';
   return {
      chart: {
         alignTicks: false
      },

      rangeSelector: {
         selected: 1
      },

      title: {
         text: name
      },

      series: [
         {
            type: 'column',
            name: name,
            data: data,
            dataGrouping: {
               units: [
                  [
                     'week', // unit name
                     [1] // allowed multiples
                  ],
                  [
                     'month',
                     [1, 2, 3, 4, 6]
                  ]
               ]
            }
         }
      ]
   }
};
const columnRangeConfig = (symbol, data) => {
   let name = symbol + ' Daily Low High';
   return {
      chart: {
         type: 'columnrange'
      },

      rangeSelector: {
         selected: 2
      },

      title: {
         text: name
      },

      series: [
         {
            type: 'columnrange',
            name: 'Low - High',
            data: data
         }
      ]
   }
};
const lineConfig = (symbol, data) => {
   let name = symbol + ' Stock Price';
   return {

      rangeSelector: {
         selected: 1
      },

      title: {
         text: name
      },

      series: [
         {
            name: name,
            data: data,
            type: 'line',
            tooltip: {
               valueDecimals: 2
            }
         }
      ]
   }
}
const areaConfig = (symbol, data) => {
   let name = symbol + ' Stock Price';
   return {

      rangeSelector: {
         selected: 1
      },

      title: {
         text: name
      },

      series: [
         {
            name: name,
            data: data,
            type: 'area',
            tooltip: {
               valueDecimals: 2
            }
         }
      ]
   }
}
const stepConfig = (symbol, data) => {
   let name = symbol + ' Stock Price';
   return {
      rangeSelector: {
         selected: 1
      },

      title: {
         text: name
      },

      series: [
         {
            name: name,
            data: data,
            step: true,
            tooltip: {
               valueDecimals: 2
            }
         }
      ]
   }
}
const splineConfig = (symbol, data) => {
   let name = symbol + ' Stock Price';
   return {

      rangeSelector: {
         selected: 1
      },

      title: {
         text: name
      },

      series: [
         {
            name: name,
            data: data,
            type: 'spline',
            tooltip: {
               valueDecimals: 2
            }
         }
      ]
   }
}
const stackColumnConfig = (symbol = "hey", data = []) => {
   let name = symbol + ' per quarter';
   return {

      title: {
         text: name
      },
      xAxis: {
         categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
      },
      yAxis: {
         min: 0,
         title: {
            text: 'Total fruit consumption'
         },
         stackLabels: {
            enabled: true,
            style: {
               fontWeight: 'bold',
               // color: 'gray'
            }
         }
      },
      tooltip: {
         headerFormat: '<b>{point.x}</b><br/>',
         pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
      },
      legend: {
         align: 'right',
         x: -30,
         verticalAlign: 'top',
         y: 25,
         floating: true,
         backgroundColor: 'white',
         borderColor: '#CCC',
         borderWidth: 1,
         shadow: false
      },
      plotOptions: {
         column: {
            stacking: 'normal',
            dataLabels: {
               enabled: true,
               // color: 'white',
               style: {
                  textShadow: '0 0 3px black'
               }
            }
         }
      },

      series: [
         {
            name: 'Q1',
            data: [5, 3, 4, 7, 2]
         }, {
            name: 'Q2',
            data: [2, 2, 3, 2, 1]
         }, {
            name: 'Q3',
            data: [3, 4, 4, 2, 5]
         }
      ]
   }
}
const multiConfig = (symbol, seriesOptions) => {
   console.log('seriesOptions', seriesOptions);
   return {
      rangeSelector: {
         selected: 4
      },

      yAxis: {
         labels: {
            formatter: function () {
               return (this.value > 0 ? ' + ' : '') + this.value + '%';
            }
         },
         plotLines: [
            {
               value: 0,
               width: 2,
               color: 'silver'
            }
         ]
      },

      plotOptions: {
         series: {
            compare: 'percent'
         }
      },

      tooltip: {
         pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
         valueDecimals: 2
      },

      series: seriesOptions
   }
}

const graphConfigs = {
   candlestick: candlestickConfig,
   spline: splineConfig,
   column: columnConfig,
   line: lineConfig,
   step: stepConfig,
   area: areaConfig,
   ohlc: ohlcConfig,
   stackColumnConfig: stackColumnConfig,
   multiconfig: multiConfig,
   columnrange: columnRangeConfig
}

export default graphConfigs;
