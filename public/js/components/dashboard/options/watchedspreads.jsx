import React from 'react';
import PositionTile from './positionTiles';

export default class WatchedSpreads extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  currentBlocks = (activePosList, posCTX) => activePosList.map( (itm) => (
    <PositionTile key={itm.ctxid + '_' + itm.type} posTileCTX={posCTX} pos={itm}/>
  ))
  render() {
    const {activePosList, PositionTiles} = this.props;
    return (
      <div className='active-spreads watched-spreads'>
        { activePosList.length === 0 && <div className='no-positions'>No Active Positions</div> }
        <ul className='pos-blocks'>
          { this.currentBlocks(activePosList, PositionTiles) }
        </ul>
      </div>
    )
  }
}
