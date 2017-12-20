import React from "react";
import Table from "dashboard/widgets/table";
import ProgressBars from "dashboard/widgets/progressbars";
import MiniGraph from "dashboard/widgets/minigraph";
import ChartWidget from "dashboard/widgets/chartwidget";

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
  graph = (data) => <MiniGraph ctxId={data.content.chartid} data={data.content.data}/>;
  table = (data) => <Table data={data}/>;
  graphjs = (data) => <ChartWidget inView={this.props.inView} cb={this.passMessage} data={data}/>;
  progress = (data) => <ProgressBars data={data}/>;
  render() {
    const {data, inView, candrag} = this.props;
    const {title, kind} = data;
    const widgets = this[kind] !== undefined ? this[kind](data) : null;

    return (
      <div className="full-widget can-drag" onDragStart={this.handleDrag} draggable="true">
        <div className={kind !== "graphjs" ? "widget-title" : "hide-elm"}>
          <h2 className={kind !== "graphjs" ? "" : "hide-elm"}>{title}</h2>
        </div>
        {widgets}
      </div>
    )
  }
};
