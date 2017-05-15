import React from 'react';
import NyseSymbols from 'data/nyse_symbols'
import NasdaqSymbols from 'data/nasdaq_symbols'

const nasdaqOptions = NasdaqSymbols.map((symbs, ii) => {
   return <option key={symbs} value={symbs}>{symbs}</option>;
});
const nyseOptions = NyseSymbols.map((symbs, ii) => {
   return <option key={symbs} value={symbs}>{symbs}</option>;
});

const exchangeOptions = {
   NASDAQ: nasdaqOptions,
   NYSE: nyseOptions
}

export default exchangeOptions;
