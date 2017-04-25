const React = require('react'); 
import PositionTile from "./positionTiles.js";


const currentBlocks = (currentPos, posCTX) => {
 let list = currentPos.map((itm, i) => {
   let keyy = itm.ctxid + '_' + itm.type 
   return <PositionTile key={keyy} posTileCTX={posCTX}  pos={itm} />;
 });
 return (<ul className="pos-blocks">{list}</ul>)
}
export default class WatchedSpreads extends React.Component {
   constructor (props) {
      super(props);
       
      
      }
    componentDidMount () {
    /*   this.CTXspread = this.props.callCT()
      this.CTXspread.seedSpread();
      this.props.setSpreadRef(this.CTXspread);
      */
   }
   componentWillMount() {
      

    }
   componentWillUnmount () {
      
   }
   render() { 
   const {activePosList, PositionTiles} = this.props;
   const posList = activePosList.length  ? currentBlocks(activePosList, PositionTiles) : <div className="no-positions">No Active Positions</div> ;
    return (   <div className="active-spreads watched-spreads">
            
            {posList}
              </div>
            )
   }
};
