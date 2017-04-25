const React = require('react');

import TickCard from "./tradecards/tickcard";
import TickerView from "./tradecards/tickerview";

const ll = [
{symb: "AUD/JPY", prc: 79.013},
{symb:"AUD/USD", prc: 0.7588},
{symb:"CAD/CHF", prc: 0.7514},
{symb:"EUR/AUD", prc: 1.4694},
{symb:"EUR/CAD", prc: 1.44065},
{symb:"EUR/GBP", prc: 0.8368},
{symb:"EUR/JPY", prc: 112.89},
{symb:"USD/BRL", prc: 3.85397},
{symb:"USD/CAD", prc: 1.31252},
{symb:"GBP/JPY", prc: 138.921},
{symb:"GBP/USD", prc: 1.3325}
];
export default class LiveTickers extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        active: 0,
        cardlist: ll,
        leftCard: null,
        updateViewed: null,
        viewedTicker: ll[0],
        applyOutAni: 88,
        hoveredCard: null,
        draggedCard: null

      }
      this.handleDragEv = this.handleDragEv.bind(this);
      this.whenDrop = this.whenDrop.bind(this);
      this.dragO = this.dragO.bind(this);
      this.dragL = this.dragL.bind(this);
      this.sideEnter = this.sideEnter.bind(this);
      this.sideLeave = this.sideLeave.bind(this);
      this.sideDrop = this.sideDrop.bind(this);
      this.dragEnter = this.dragEnter.bind(this);
      this.dropHandle = this.dropHandle.bind(this);
       this.postionClick = this.postionClick.bind(this);
    };
     postionClick (ind) {
      let {leftCard , hoveredCard , updateViewed, cardlist} = this.state;
      if (hoveredCard !== leftCard &&  hoveredCard !== null && updateViewed !== null){
        this.whenDrop(hoveredCard);
        return '';
      }
    
      let cardSymbol = updateViewed ? updateViewed : cardlist[ind];
      let price = cardSymbol.prc < 10 ? Math.round(cardSymbol.prc * 100) : Math.round(cardSymbol.prc);
      this.props.cardCtx.chartView.newSet(cardSymbol.symb, price);
      this.setState({
        active: ind,
        cardlist: cardlist, 
        applyOutAni: null,
        updateViewed: null,
        draggedCard: null,
        leftCard: null,
        hoveredCard: null,
        viewedTicker:cardSymbol
      })
    }
  handleDragEv (index) {
     // 
      this.setState({
       draggedCard: index,
       applyOutAni: null
      })

  };
  dragO (index) {
      this.setState({
       hoveredCard: index 
      })

  };
  sideEnter (e) {
    console.log('sideEntered');
     e.preventDefault();e.stopPropagation();
    let {cardlist,draggedCard } = this.state;
     this.setState({
        updateViewed: cardlist[draggedCard] 
      });
  }
  sideLeave (e) {
     console.log('sideLeft');
      e.preventDefault();e.stopPropagation();
    this.setState({
        updateViewed: null 
      });
  }
  dragL (index) {
     // 
      this.setState({
       leftCard: index 
      })

  };
  onDragOver (e) {
    e.preventDefault();
    
  }
  sideDrop () {
     let cardlist = this.state.cardlist;
     let cardSymbol = this.state.updateViewed;
   
     this.setState({
        cardlist: cardlist,
        updateViewed: null,
        viewedTicker: cardSymbol,
        applyOutAni: null,
        leftCard: null,
        draggedCard: null
      })

  }
  dropHandle (){
     let {cardlist , updateViewed} = this.state;
    let draggedSymb = cardlist[this.state.draggedCard];
    let cardlst = cardlist.reduce((obb,itm, i) => {
       if (itm.symb !== draggedSymb.symb){
          obb.push(itm);
       }
      
       return obb;
    },[]);

    cardlst.push(draggedSymb);
    let cardSymbol = updateViewed ? draggedSymb : this.state.viewedTicker;
     this.setState({
       cardlist: cardlist,
        hoveredCard: null,
        updateViewed: null,
        viewedTicker: cardSymbol,
        applyOutAni: cardlst.length -1,
        leftCard: null,
       draggedCard: null
      })

  }
  dragEnter (e) {
    e.preventDefault();e.stopPropagation();
    

  };
  whenDrop (index) {
    let draggedSymb = this.state.cardlist[this.state.draggedCard];
    let cardlist = this.state.cardlist.reduce((obb,itm, i) => {
       if(index === i){
         obb.push(draggedSymb);
       }
       if (itm.symb !== draggedSymb.symb){
          obb.push(itm);
       }
      
       return obb;
    },[]);
    
     this.setState({
       cardlist: cardlist,
        hoveredCard: null,

        applyOutAni: index,
        leftCard: null,
       draggedCard: null
      })
  }
  dragLeave (e) {
    e.preventDefault();e.stopPropagation();
  
  };
  componentDidMount (){
    this.props.cardCtx.chartView.symb = ll[0].symb;
    this.props.cardCtx.chartView.priceSeed = ll[0].prc;
    this.props.cardCtx.chartView.render();
  }
    componentWillMount () {
    
      }
    render() {  

   let {draggedCard, applyOutAni} = this.state;
   const tickCards =  this.state.cardlist.map((itm, i) => {
     let ani = ""
      if (applyOutAni === i || draggedCard === i ){
        ani = i === draggedCard ? 'scaleSmall  ease-out 0.4s 1 forwards' : 'growBig  ease-out 0.3s 1 forwards';
      }
        
    return   <TickCard key={i+'_ww'} active={this.state.active === i} applyOut={applyOutAni === i} cardCtx={this.props.cardCtx} ani={ani} cardId={`card_${itm.symb}`} mU={this.postionClick.bind(this)} dL={this.dragL.bind(this)} dO={this.dragO.bind(this)} dH={this.whenDrop.bind(this)} dS={this.handleDragEv.bind(this)} index={i} symbol={itm} />;
           
    });
    return (<div  className="container-fluid wrapper"> 
      
           <section id="cardContain">
          {tickCards}
          <div className="trade-card-holder normal-class">
          <div id="AddTicker" onDragOver={this.dragEnter.bind(this)} onDrop={this.dropHandle.bind(this)}>
          <i className="fa fa-plus big-fa" aria-hidden="true"></i>
          </div>
          </div>
           </section>
           <section className="side-look-at"  onDragEnter={this.sideEnter.bind(this)} onDrop={this.dropHandle.bind(this)}  onDragLeave={this.sideLeave.bind(this)} >
           <TickerView symbol={this.state.viewedTicker}  />
           </section>

           <section id="bottomLookUp">
           </section>
          </div>
            )
   }
};