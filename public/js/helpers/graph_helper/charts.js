import {randomFinancial} from 'd3fc-random-data';

const getRandomData = (seedDate, price) => randomFinancial().startDate(new Date()).startPrice(price);

const donutConfig = (data, {height, animate, background, msAni}) => ({
  height: height ? height : 150,
  animationEnabled: animate ? animate : true,
  backgroundColor: background ? background : "#18252e",
  animationDuration: msAni ? msAni : 1300,
  legend: {
    verticalAlign: "top",
    horizontalAlign: "center"
  },
  data: [
    {
      startAngle: 45,
      type: "doughnut",
      dataPoints: data
    }
  ]
})

const columnConfig = (data, {height, animate, background, msAni}) => ({
  height: height ? height : 150,
  animationEnabled: animate ? animate : true,
  backgroundColor: background ? background : "#18252e",
  animationDuration: msAni ? msAni : 1300,
  data: [
    {
      type: "column",
      dataPoints: data
    }
  ]
})

const rangeAreaConfig = (data, {height, animate, background, msAni}) => ({
  height: height ? height : 150,
  animationEnabled: animate ? animate : true,
  backgroundColor: background ? background : "#18252e",
  animationDuration: msAni ? msAni : 1300,
  data: [
    {
      type: "rangeArea",
      fillOpacity: .6,
      markerType: "none",
      dataPoints: data
    }
  ]
})

const plainMultiSeries = (data, settings = {}) => {
  return {
    interactivityEnabled: false,
    axisX: {
      valueFormatString: " ",

      tickLength: 1,
      //  labelFontColor:  settings.background ? settings.background : "#18252e",
      lineThickness: 1
    },
    axisY: {
      valueFormatString: "",
      gridThickness: 0.3,
      minimum: settings.min,
      maximum: settings.max,
      includeZero: false,
      tickLength: 1,
      margin: 5,
      //  labelFontColor:  settings.background ? settings.background : "#18252e",
      gridColor: "#224458",
      lineThickness: 1
    },
    backgroundColor: settings.background ? settings.background : "#18252e",
    animationEnabled: true,
    animationDuration: 1300,
    data: data
  }
}
const volumeAndRange = (data, price) => {
  let theMin = price * 2;
  let theMax = 0;
  let points = data.reduce((ob, itm) => {
    ob.range.push({
      x: itm.date,
      y: [itm.low, itm.high]
    });
    let colColor = itm.open < itm.close ? "#30d94c" : "red";
    theMin = Math.min(theMin, itm.low);
    theMax = Math.max(theMax, itm.high);
    ob.column.push({
      x: itm.date,
      y: Math.floor((itm.volume / 1000)),
      color: colColor
    });
    return ob;
  }, {
    column: [],
    range: []
  });
  let columns = points.column.map((itm) => {
    itm.y = Math.floor((Math.random() * ((theMax - theMin)) / 3) + theMin);
    return itm;
  });
  return {
    minMax: {
      min: theMin,
      max: theMax
    },
    d: [
      {
        type: "column",
        dataPoints: columns
      }, {
        type: "rangeArea",
        fillOpacity: .6,
        markerType: "none",
        dataPoints: points.range
      }

    ]
  };
}
const kindConfig = (kind, data, settings) => {
  switch (kind) {
    case "doughnut":
      return donutConfig(data, settings);
      break;
    case "bar":
      return false;
      break;
    case "pie":
      return false;
      break;
    case "multiseriesPlain":
      return plainMultiSeries(data, settings);
      break;
    case "rangeArea":
      return false;
      break;
    case "column":
      return false;
      break;
    case "scatter":
      return false;
  }
  return false;
}

const makeChart = (chartId, data, kind, settings) => {
  let theId = chartId;
  let theSettings = settings;
  let theConfig = kindConfig(kind, data, settings);
  console.log('theConfig', theConfig);
  let chart = new CanvasJS.Chart(chartId, theConfig);
  console.log('chart', chart)
  return {
    renderChart: () => {
      chart.render();
    },
    newSet: (newdata) => {
      theConfig = kindConfig(kind, newdata, theSettings);
      chart = new CanvasJS.Chart(theId, theConfig);
      chart.render();
    }
  }

};
const makeComboChart = (chartId, data, kind, settings) => {

  let theId = chartId;
  let res = volumeAndRange(getRandomData(new Date(), data.price)(data.len), data.price);
  let dataSets = res.d;
  let theSettings = {
    min: res.minMax.min,
    max: res.minMax.max
  };
  let theConfig = kindConfig("multiseriesPlain", dataSets, theSettings);
  console.log('theConfig', theConfig);
  let chart = new CanvasJS.Chart(chartId, theConfig);
  console.log('chart', chart)
  chart.render();
  return {
    renderChart: () => {
      chart.render();
    },
    genData: (pr, ln) => {
      let res = volumeAndRange(getRandomData(new Date(), data.price)(data.len), data.price);
      dataSets = res.d;
      theConfig = kindConfig("multiseriesPlain", dataSets, {
        min: res.minMax.min,
        max: res.minMax.max
      });
      chart = new CanvasJS.Chart(theId, theConfig);
      chart.render();
    },
    newSet: (newdata) => {
      theConfig = kindConfig(kind, newdata, theSettings);
      chart = new CanvasJS.Chart(theId, theConfig);
      chart.render();
    }
  }

};
const chartMaker = {
  makeComboChart: makeComboChart,
  makeChart: makeChart
};

export default chartMaker;
