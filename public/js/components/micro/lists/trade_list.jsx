import React from "react";
import ForexList from "micro/lists/forexlist";
import StockList from "micro/lists/socklist";

const TradeListBlock = (indices, seriesWatch, addNewChart) => {
  if (indices === "stocks") {
     return <StockList used={seriesWatch} startChart={addNewChart}/>;
  }
  if (indices === "forex") {
     return <ForexList used={seriesWatch} startChart={addNewChart}/>;
  }
}
export default TradeListBlock;
