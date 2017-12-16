const makeGraph = (chartId, data, title) => {
  const theData = {
    data: {
      type: 'doughnut',
      dataPoints: data
    },

    title: 'Top U.S Smartphone Operating Systems By Market Share, Q3 2012'
  }
  const chart = new CanvasJS.Chart(chartId, {
    height: 80,
    animationEnabled: true,
    animationDuration: 1300,
    data: [theData.data]
  });
  return {
    renderChart: () => {
      chart.render();
    },
    newData: (data) => {
      chart.render();
    }
  }

};

export default makeGraph;
