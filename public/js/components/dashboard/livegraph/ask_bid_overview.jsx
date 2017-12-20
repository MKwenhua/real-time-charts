import React from 'react';

export default class AskBidOverview extends React.PureComponent {
  posValue(pos, valIndex) {
    if (pos.point === undefined) return '';
    return '$' + (Math.round(pos.point.data[valIndex] * 100) / 100);
  }
  render() {
    const { timeExpires, valIndex } = this.props;
    const pos = this.props.pos === null ? { isnull: true } : this.props.pos;
    return (
      <div className={ pos.isnull === true ? 'hide-elm' : 'trade-description' }>
        <div className='trn-blk trn-symb'>
          <span>Symbol</span>
          <span>{pos.symb || 'NONE'}</span>
        </div>
        <div className='trn-blk'>
          <span>Quantity</span>
          <span>{pos.qty || 0}</span>
        </div>
        <div className='trn-blk'>
          <span>PPU</span>
          <span>{this.posValue(pos, valIndex)}</span>
        </div>
        <div className='trn-blk'>
          <span>Expires</span>
          <span>{timeExpires}</span>
        </div>
      </div>
    )
  }
}
