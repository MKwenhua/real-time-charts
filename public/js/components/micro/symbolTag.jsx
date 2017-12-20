import React from "react";

const pnctChange = (op, cl, bool) => {
   let sign = bool ? '+' : '-';
   return sign + String(Math.abs((((cl - op) / op) * 100).toFixed(2))) + '%';
}
export default class SymbolTag extends React.PureComponent {

   render() {
      const arrow = this.props.sm.isUp ? <i className="material-icons pos">arrow_drop_up</i> : <i className="material-icons neg">arrow_drop_down</i>;
      const chng = pnctChange(this.props.sm.open, this.props.sm.num, this.props.sm.isUp);
      return (
         <li key={this.props.sm.sym + '_tag'}>
            <span>{this.props.sm.sym}</span>
            <span className={this.props.sm.isUp ? "stock-tag is-up" : "stock-tag is-down"}>
               {this.props.sm.num}</span>
            <span className="span-i">{arrow}</span>
            <span className="prnct-show">{chng}</span>
         </li>
      )
   }
};
