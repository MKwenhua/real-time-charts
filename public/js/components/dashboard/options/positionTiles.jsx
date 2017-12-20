import React from 'react';

export default class PositionTile extends React.PureComponent {
  componentDidMount() {
    this.props.posTileCTX.setTile(this.props.pos, this.props.pos.ctxid);
  }
  render() {
    let {pos} = this.props;
    return (
      <li className={pos.type === 'CALL' ? 'pos-block pos-call' : 'pos-block pos-put'}>
        <div className='span-label-blue th-span div-symb-hold'>{pos.symb}</div>
        <div>{pos.qty}</div>
        <canvas id={pos.ctxid} width='100' height='30'></canvas>
      </li>

    )
  }
}
