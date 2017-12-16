import React from 'react';
import ForexList from 'data/lists/forexlist';
import StockList from 'data/lists/socklist';

const TradeListBlock = (indices, seriesWatch, addNewChart) => {
  if (indices === 'stocks') {
     return <StockList used={seriesWatch} startChart={addNewChart}/>;
  }
  if (indices === 'forex') {
     return <ForexList used={seriesWatch} startChart={addNewChart}/>;
  }
}
export default TradeListBlock;
