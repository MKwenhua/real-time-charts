const donutConfig = (data, ani = true) => {
  return {
    animationEnabled: ani,
    animationDuration: 1300,
    data: {
      type: 'doughnut',
      dataPoints: data
    }
  }

}

const kindConfig = (kind, data) => {
  switch (kind) {
    case 'doughnut':
      return donutConfig(data, true);
      break;
    case 'bar':
      return false;
      break;
    case 'pie':
      return false;
      break;
    case 'rangeArea':
      return false;
      break;
    case 'column':
      return false;
      break;
    case 'scatter':
      return false;
  }
  return false;
}

const makeChart = (chartId, data, kind) => {
  let theConfig = kindConfig(kind, data);
  const chart = new CanvasJS.Chart(chartId,);
  return {
    renderChart: () => {
      chart.render();
    },
    newData: (data) => {
      chart.render();
    }
  }

};

module.exports = makeChart;
