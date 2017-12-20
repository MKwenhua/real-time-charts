import {randomFinancial} from 'd3fc-random-data';

const Tickers = {}
const closeGet = (theSymb, prc) => {
   return () => {
      const generator = randomFinancial().startDate(new Date()).startPrice(prc)

      const stream = generator.stream();
      Tickers[theSymb].stream = stream;
      Tickers[theSymb].data.push(stream.next());
      Tickers[theSymb].logData();
      console.log('hshshs sleeot');
   }

}

const GENTICKS = {
   newTicker: (symb, price) => {
      let tickSymb = {
         data: [],
         symbol: symb,
         startPrice: price
      };
      tickSymb.logData = () => {
         let self = tickSymb;
         console.log('data', self.data);
         setTimeout(function () {
            self.data.push(self.stream.next());
            self.logData()
         }, 1000);
      };

      tickSymb.startTicks = closeGet(symb, price);

      tickSymb.startTicks.bind(tickSymb)
      Tickers[symb] = tickSymb
      tickSymb.startTicks()
   }
}

// data.length -> 1

//data = data.concat(stream.take(20));
// data.length -> 3

//data = data.concat(stream.until(d => d.date > new Date(2016, 0, 10)));
// data.length -> 10

module.exports = GENTICKS;
