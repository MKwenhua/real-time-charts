import chartMaker from 'graph_helpers/charts.js';

const askBidVolume = (bool, v1, v2) => {
   if (bool) {
      return [
         Math.max(v1, v2),
         Math.min(v1, v2)
      ]
   }
   return [
      Math.min(v1, v2),
      Math.max(v1, v2)
   ]

};

class GraphController {
	constructor() {
		this.donutChart = null;
		this.comboChart = null;
    this.posProps = {
      pricestart: 0,
      priceend: 0
    }
	}
  updatePosProps = ({pricestart, priceend}) => {
    this.posProps = {
      pricestart,
      priceend
    }
  }
  createCharts = ({pricestart, priceend}) => {
    this.posProps = {
      pricestart,
      priceend
    }
    this.donutChart = chartMaker.makeChart('chart1view', this.ratioData(), 'doughnut', {
       height: 150,
       animate: true,
       background: '#18252e',
       msAni: 900
    })
    this.comboChart = chartMaker.makeComboChart('chart2view', {
       price: pricestart,
       len: 30
    }, {
       msAni: 900,
       aYmin: pricestart * 0.8
    });
  }
  ratioData = () => {
    const askBid = askBidVolume(this.posProps.pricestart < this.posProps.priceend, (Math.floor(Math.random() * 10000) + 1000), (Math.floor(Math.random() * 10000) + 1000));

    return [
       {
          y: askBid[0],
          name: 'Bid',
          fillOpacity: .9,
          legendText: 'Bid',
          color: '#30d94c'
       }, {
          y: askBid[1],
          name: 'Ask',
          fillOpacity: .9,
          legendText: 'Ask',
          color: 'red'
       }
      ]
  }
  updateCharts = () => {
    this.donutChart.newSet(this.ratioData())
    this.comboChart.genData(this.posProps.pricestart, 30);
  }
	renderCharts = () => {
    if (this.donutChart === null || this.comboChart === null ) {
      return false;
    }
    setTimeout(this.updateCharts, 70);
	}
}

const viewCntrl = new GraphController();

export default viewCntrl;
