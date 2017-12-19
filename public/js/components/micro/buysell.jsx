import React from "react";
import TimeIntervals from "micro/timeintervals"

const positionOverView = (pos, ind) => {
   if (!pos) {
      return null;
    }

   const d = new Date();
   const time = d.getHours() + ':' + ('0' + (d.getMinutes() + pos.time)).slice(-2);
   return (
      <div className="trade-description">
         <div className="trn-blk trn-symb">
            <span>Symbol</span>
            <span>{pos.symb}</span>
         </div>
         <div className="trn-blk">
            <span>Quantity</span>
            <span>{pos.qty}</span>
         </div>
         <div className="trn-blk">
            <span>PPU</span>

            <span>{'$' + (Math.round(pos.point.data[ind] * 100) / 100)}</span>
         </div>
         <div className="trn-blk">
            <span>Expires</span>
            <span>{time}</span>
         </div>
      </div>
   );
}
export default class CallPut extends React.PureComponent {
   constructor(props) {
      super(props);
      this.clock = null;
      this.state = {
         timeMenuOpen: false,
         menutype: null,
         qnty: 1,
         bidOpen: false,
         askOpen: false,
         bidBtnClass: "",
         putBtnClass: "",
         tmSet: 1,
         posNum: 0,
         symb: props.mainSym,
         pos: null,
         timeList: null
      }
   }
   toggleMenuBid = () => {
      let pos = this.state.pos ? this.state.pos : {
         qty: 1,
         time: this.state.tmSet,
         point: {
            data: [2, 3, 2, 2]
         },
         symb: this.props.mainSym
      };
      pos.qty = this.state.qnty;
      pos.type = "CALL";
      pos.point = this.props.ctxChart.getLatestPoint();
      pos.unitPrice = pos.point.data[2];
      this.setState({bidOpen: true, askOpen: false, timeMenuOpen: false, pos: pos});
   }
   toggleMenuAsk = () => {
      let pos = this.state.pos ? this.state.pos : {
         qty: 1,
         time: this.state.tmSet,
         point: {
            data: [2, 3, 2, 2]
         },
         symb: this.props.mainSym
      };
      pos.qty = this.state.qnty;
      pos.type = "PUT";
      pos.point = this.props.ctxChart.getLatestPoint();
      pos.unitPrice = pos.point.data[1];
      this.setState({askOpen: true, bidOpen: false, timeMenuOpen: false, pos: pos});
   }
   setPosTime = (tm) => {
      let pos = this.state.pos ? Object.assign({}, this.state.pos) : {
         qty: 1,
         time: this.state.tmSet,
         point: {
            data: [2, 3, 2, 2]
         },
         symb: this.props.mainSym
      };
      pos.time = tm;
      pos.qty = this.state.qnty;
      pos.point = this.props.ctxChart.getLatestPoint();
      pos.symb = this.state.symb;
      this.setState({
         timeList: <TimeIntervals ind={tm} timeSet={this.setPosTime.bind(this)}/>,
         tmSet: tm,
         pos: pos
      });

   }
   posSet = (bidOrAsk) => () => {
      let {pos, posNum} = Object.assign({}, this.state);
      let d = new Date();
      pos.expires = d.getHours() + ':' + ('0' + (d.getMinutes() + pos.time)).slice(-2);
      pos.timestamp = new Date(new Date().getTime() + pos.time * 60000);
      posNum += 1;
      pos.type = bidOrAsk;
      pos.getLatestPoint = this.props.ctxChart.getLatestPoint;
      pos.ctxid = pos.symb + '_' + Date.now().toString().slice(-4);
      this.props.newPos(Object.assign({}, pos));
      this.setState({askOpen: false, bidOpen: false, posNum: posNum, pos: null});

   }
   closeModal = () => {
      this.setState({askOpen: false, bidOpen: false, bidBtnClass: "", putBtnClass: ""});
   }
   menuSet = () => {
      this.setState({timeMenuOpen: false});
   }
   timeMenuOpen = () => {
      this.setState({
         timeMenuOpen: !this.state.timeMenuOpen,
         timeList: <TimeIntervals ind={this.state.tmSet} timeSet={this.setPosTime.bind(this)}/>
      });
   }
   plusMinus = (num) => () => {
      let qnty = (this.state.qnty + num) > 0 ? this.state.qnty + num : 1;
      let pos = this.state.pos ? Object.assign({}, this.state.pos, {qty: qnty}) : null;

      this.setState({qnty: qnty, pos: pos});
   }

   btnPtnpush = (bool) => () => {
      if (bool) {
         let btn = this.state.bidBtnClass === "button-click" ? "button-in" : "button-click";
         this.setState({bidBtnClass: btn, putBtnClass: ""});
      } else {
         let btn = this.state.putBtnClass === "button-click" ? "button-in" : "button-click";
         this.setState({putBtnClass: btn, bidBtnClass: ""});
      }
   }
   componentDidMount() {

      this.clock = this.props.clockCtx.setClock(this.props.timerId);
      this.clock();
   }
   componentWillUnmount() {

      this.clock = null;
   }
   render() {
      const {putBtnClass, bidBtnClass} = this.state;
      const askOverview = positionOverView(this.state.pos, 1);
      const bidOverview = positionOverView(this.state.pos, 2);
      return (
         <div className="option-buy-sell reduct">
            <div id="timeMenu" className={this.state.timeMenuOpen ? "zing-in-fast" : "hide-elm"}>
               <strong>Position Expiration</strong>
               {this.state.timeList}
               <div className="cool-button  add-chart-bt set-pos" onClick={this.menuSet.bind(this)}>Set Time</div>

            </div>
            <div id="Bid" className={this.state.bidOpen ? "bounce-in-fast" : "hide-elm"}>
               <p className="pos-type-header call-t">Call Position
               </p>
               <i className="material-icons  close-modal" onClick={this.closeModal.bind(this)}>clear</i>
               {bidOverview}
               <div className="cool-button  add-chart-bt set-pos" onClick={this.posSet("CALL")}>Place Order</div>
            </div>
            <div id="Ask" className={this.state.askOpen ? "bounce-in-fast" : "hide-elm"}>
               <p className="pos-type-header put-t">Put Position</p>
               <i className="material-icons close-modal" onClick={this.closeModal.bind(this)}>clear</i>
               {askOverview}

               <div className="cool-button  add-chart-bt set-pos" onClick={this.posSet("PUT")}>Place Order</div>
            </div>
            <p className="text-wrap-values time-ticker time-v" onClick={this.timeMenuOpen.bind(this)}>
               <canvas id={this.props.timerId} height={18} width={66}></canvas>
            </p>
            <p className="text-wrap-values time-ticker">
               <strong>{this.state.qnty}</strong>
            </p>
            <div className="text-wrap-values plus-minus sub-v" onClick={this.plusMinus(-1)}>
               <i className="material-icons">remove</i>
            </div>
            <div className="text-wrap-values plus-minus add-v" onClick={this.plusMinus(1)}>
               <i className="material-icons">add</i>
            </div>
            <p className="profit">
               71%
            </p>

            <div className={"trade-butt put-butt " + bidBtnClass} onMouseDown={this.btnPtnpush(true)} onMouseUp={this.toggleMenuBid.bind(this)}>
               <img src="/icons/gain.png"/>
               <strong>Call</strong>
            </div>
            <div className={"trade-butt call-butt " + putBtnClass} onMouseDown={this.btnPtnpush(false)} onMouseUp={this.toggleMenuAsk.bind(this)}>
               <img src="/icons/loss.png"/>
               <strong>Put</strong>
            </div>
         </div>
      )
   }
};
