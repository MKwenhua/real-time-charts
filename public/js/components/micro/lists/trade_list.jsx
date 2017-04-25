import React from "react";
import ForexList from "micro/lists/forexlist";
import StockList from "micro/lists/socklist";

const TradeListBlock = (indices, that) => {
   if (indices === "stocks") {
      return <StockList used={that.props.rt.seriesWatch} startChart={that.addNewChart.bind(that)}/>;
   }
   if (indices === "forex") {
      return <ForexList used={that.props.rt.seriesWatch} startChart={that.addNewChart.bind(that)}/>;
   }
}
export default TradeListBlock;
