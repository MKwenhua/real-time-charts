import React from 'react';
import Table from 'dashboard/widgets/table';
import ProgressBars from 'dashboard/widgets/progressbars';
import MiniGraph from 'dashboard/widgets/minigraph';
import ChartWidget from 'dashboard/widgets/chartwidget';
const getContent = (data, cb, inView) => {
  switch (data.kind) {
    case 'table':
      return <Table data={data}/>;
      break;
    case 'graphjs':
      return <ChartWidget inView={inView} cb={cb} data={data}/>;
      break;
    case 'progress':
      return <ProgressBars data={data}/>;
      break;

  }
  return null;
}
export default class FullWidget extends React.PureComponent {
  constructor(props) {
    super(props);
  };
  handleDrag = () => {
    this.props.whenDrag(this.props.wd, this.props.data)
  }
  passMessage = (mess) => {
    this.props.ms(mess, this.props.wd);
  }
  render() {
    const {data, inView, candrag} = this.props;
    let {title, kind, content} = data;
    const widgets = kind === 'graph' ? <MiniGraph ctxId={content.chartid} data={content.data}/> : getContent(data, this.passMessage, inView);
    if (candrag === 'true') {
      return (
        <div className='full-widget can-drag' onDragStart={this.handleDrag} draggable='true'>
          <div className={kind !== 'graphjs' ? 'widget-title' : 'hide-elm'}>
            <h2 className={kind !== 'graphjs' ? '' : 'hide-elm'}>{title}</h2>
          </div>
          {widgets}
        </div>
      )
    }
    return (
      <div className='full-widget'>
        <div className='widget-title'>
          <h2>{title}</h2>
        </div>
      </div>
    )
  }
};
