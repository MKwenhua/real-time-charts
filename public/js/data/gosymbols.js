import React from 'react';
import NyseSymbols from 'data/nyse_symbols'
import NasdaqSymbols from 'data/nasdaq_symbols'

const exchangeSymbs = (usedItms) => {
   const nasdaqOptions =  NasdaqSymbols.map((symbs, ii) => {
      if (usedItms.test(symbs)) {
         return null;
      } else {
         return <option key={symbs} value={symbs}>{symbs}</option>;
      }
   });
   const nyseOptions = NyseSymbols.map((symbs, ii) => {
      if (usedItms.test(symbs)) {
         return null;
      } else {
         return <option key={symbs} value={symbs}>{symbs}</option>;
      }
   });

   return {
      NASDAQ: nasdaqOptions,
      NYSE: nyseOptions
   }
}
export default  exchangeSymbs;
