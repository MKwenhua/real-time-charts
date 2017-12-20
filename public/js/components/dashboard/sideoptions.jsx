import React from 'react';

export default class SideOptions extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  optionView = (type) => () => this.props.itmView(type)
  render() {
    const {platformView, optsComponent, tdClass, onStart} = this.props;
    return (
      <div id='sideOptions' className={onStart ? 'hide-elm' : ''}>
        <div onClick={this.optionView('overview')} className={platformView === 'trade history' ? 'opts-button opts-active-sec' : 'opts-button'}>
          <i className='material-icons'>update</i>
          <p>TRADING HISTORY</p>
        </div>
        <div onClick={this.optionView('charts')} className={platformView === 'live graphs' ? 'opts-button opts-active-sec' : 'opts-button'}>
          <i className='fa fa-line-chart fix-fa' aria-hidden='true'></i>
          <p>CHARTS</p>
        </div>
        <div onClick={this.optionView('current-bids')} className={(optsComponent === 'current-bids' && tdClass) ? 'opts-button opts-active' : 'opts-button'}>
          <i className='material-icons'>event_available</i>
          <p>POSITIONS</p>
        </div>
        <div onClick={this.optionView('spreads')} className={(optsComponent === 'spreads' && tdClass) ? 'opts-button opts-active' : 'opts-button'}>
          <i className='material-icons'>view_list</i>
          <p>OPTIONS</p>
        </div>
        <div onClick={this.optionView('live options')} className={platformView === 'live options' ? 'opts-button opts-active-sec' : 'opts-button'}>
          <i className='material-icons'>view_compact</i>
          <p>OPTIONS</p>
        </div>
        <div onClick={this.optionView('past-pos')} className={platformView === 'trade list' ? 'opts-button opts-active-sec' : 'opts-button'}>
          <i className='material-icons'>watch_later</i>
          <p>HISTORY</p>
        </div>
      </div>
    )
  }
};
