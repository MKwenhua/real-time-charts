
const candlestickConfig = (symbol, data) => {
	let name = symbol + ' Stock Price';
	return {
			rangeSelector : {
		                selected : 1
		            },

		            title : {
		                text : name
		            },
		 	series : [{
                type : 'candlestick',
                name : name,
                data : data,
                dataGrouping : {
                    units : [
                        [
                     				'week',
                            [1] 
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]
                    ]
                }
            }]
		   };
}; 
const ohlcConfig = (symbol, data) => {
	let name = symbol + ' Stock Price';
	return {
			rangeSelector : {
		                selected : 1
		            },

		            title : {
		                text : name
		            },
		 	series : [{
                type : 'ohlc',
                name : name,
                data : data,
                dataGrouping : {
                    units : [
                        [
                     				'week',
                            [1] 
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]
                    ]
                }
            }]
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

      series: [{
          type: 'column',
          name: name,
          data: data,
          dataGrouping: {
              units: [[
                  'week',
                  [1] 
              ], [
                  'month',
                  [1, 2, 3, 4, 6]
              ]]
          }
      }]
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

    series: [{
    	  type: 'columnrange',
        name: 'Low - High',
        data: data
    }]
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

    series: [{
        name: name,
        data: data,
        type: 'line',
        tooltip: {
            valueDecimals: 2
        }
    }]
	}
}
const stepConfig = (symbol, data) => {
	let name = symbol + ' Stock Price';
	  return {
	  rangeSelector: {
          selected: 1
      },

      title: {
          text:name
      },

      series: [{
          name: name,
          data: data,
          step: true,
          tooltip: {
              valueDecimals: 2
          }
      }]
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

    series: [{
        name: name,
        data: data,
        type: 'spline',
        tooltip: {
            valueDecimals: 2
        }
    }]
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
          plotLines: [{
              value: 0,
              width: 2,
              color: 'silver'
          }]
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
module.exports = {

	candlestick: candlestickConfig,
	spline: splineConfig,
	column: columnConfig,
	line: lineConfig,
	step: stepConfig,
	ohlc: ohlcConfig, 
	multiconfig: multiConfig,
	columnrange:columnRangeConfig

}

