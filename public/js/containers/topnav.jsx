import React from 'react';

export default class TopNav extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  goState = (path) => () => {
    window.checkPath(path);
  }
  render() {
    return (
      <nav id='topNav' className={this.props.theClass}>
        <span onClick={this.goState('/history')} className={(this.props.pathName === '/history' || this.props.pathName === '/') ? 'blocked-at' : ''}>History</span>
        <span onClick={this.goState('/realtime')} className={this.props.pathName === '/realtime' ? 'blocked-at' : ''}>Real Time</span>
        <span onClick={this.goState('/map')} className={this.props.pathName === '/map' ? 'blocked-at' : ''}>Map Thing</span>
      </nav>

    );
  }
};
