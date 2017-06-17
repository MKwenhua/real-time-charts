import React from 'react';
import NyseSymbols from 'data/nyse_symbols'
import NasdaqSymbols from 'data/nasdaq_symbols'

const exchangeSymbols = (usedSymbols) => {
   const nasdaqOptions =  NasdaqSymbols.map((symbol, ii) => {
      if (usedSymbols[symbol]) {
         return null;
      } else {
         return <option key={symbol} value={symbol}>{symbol}</option>;
      }
   });
   const nyseOptions = NyseSymbols.map((symbol, ii) => {
      if (usedSymbols[symbol]) {
         return null;
      } else {
         return <option key={symbol} value={symbol}>{symbol}</option>;
      }
   });

   return {
      NASDAQ: nasdaqOptions,
      NYSE: nyseOptions
   }
}
export default  exchangeSymbols;
