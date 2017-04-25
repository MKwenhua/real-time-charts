const React = require('react');

import MiniGraph from "./minigraph";

export default class FullWidget extends React.Component {
   constructor(props) {
      super(props);
      this.state = {


      }
      this.handleDrag = this.handleDrag.bind(this);
   };
   handleDrag() {
      this.props.whenDrag(
         this.props.wd,
         this.props.data
      )
   }
   componentDidMount() {

   }
   componentWillMount() {

   }
   componentWillUnmount() {

   }
   render() {
      const content = this.props.data.kind === "graph" ? <MiniGraph ctxId={this.props.data.content.chartid } data={this.props.data.content.data} /> : "hey";
      if (this.props.candrag === "true") {
         return (<div className="full-widget can-drag" onDragStart={this.handleDrag.bind(this)} draggable="true">
                <div className="widget-title">
                <h2>{this.props.data.title}</h2>
                </div>
                  {content}
            </div>)
      } else {
         return (<div className="full-widget" >
                <div className="widget-title">
                 <h2>{this.props.data.title}</h2>
                 </div>
            </div>)
      }
   }
};