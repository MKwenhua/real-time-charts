import React from "react";

const setDropHandle = (dropHandle, index) => {
   return (e) => {
      dropHandle(index)
   }
}

const setDragStart = (dragStart, index) => {
   return (e) => {
      dragStart(index)
   }
}

export default class AddTicker extends React.PureComponent {

   onDragOver = (e) => {
      e.preventDefault();

   }
   dragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();

   };
   dragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();

   };

   render() {
      const {
         actionClass,
         cardId,
         symbol,
         dH,
         dS,
         index
      } = this.props;
      return (
         <div className={actionClass} onDragLeave={this.dragLeave} onDragOver={this.dragEnter} onDrop={setDropHandle(dH, index)}>
            <div className="trade-card" draggable="true" onDragStart={setDragStart(dS, index)}>
               <p className="span-label-blue symb-label">{symbol}</p>
               <canvas id={cardId} width="90" height="60"></canvas>
            </div>
         </div>
      )
   }
};
