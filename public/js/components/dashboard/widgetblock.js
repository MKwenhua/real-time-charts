const React = require('react');
import FullWidget from "./widgets/fullwidget";
const ex1 = [{
   y: 8211,
   name: "Bid",
   legendText: "Bid",
   color: "#30d94c"
}, {
   y: 6755,
   name: "Ask",
   legendText: "Ask",
   color: "red"
}];
const WidgetList = {
   widget1: {
      title: "stuff",
      kind: "graph",
      content: {
         chartid: "somedata",
         data: ex1
      }
   },
   widget2: {
      title: "Title1",
      kind: "",
      content: {}
   },
   widget3: {
      title: "Title1",
      kind: "",
      content: {}
   },
   widget4: {
      title: "Title1",
      kind: "",
      content: {}
   }
}

export default class WidgetBlock extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         rowTop: {
            height: "50%"
         },
         rowBtm: {
            height: "50%"
         },
         draggedWidget: null,
         overWidget: null,
         widget1: {
            clType: "col-xs-6 widget-box",
            colType: 6,
            style: {},
            holdType: "FullWidget",
            shown: true,
            data: WidgetList.widget1,
            comp: <FullWidget whenDrag={this.handleDragEv.bind(this)} data={WidgetList.widget1} wd="widget1" candrag="true"/>

         },
         widget2: {
            clType: "col-xs-6 widget-box",
            colType: 6,
            style: {},
            shown: true,
            holdType: "FullWidget",
            data: WidgetList.widget2,
            comp: <FullWidget  whenDrag={this.handleDragEv.bind(this)} data={WidgetList.widget2} wd="widget2" candrag="true"/>

         },
         widget3: {
            clType: "col-xs-6 widget-box",
            colType: 6,
            style: {},
            shown: true,
            holdType: "FullWidget",
            data: WidgetList.widget3,
            comp: <FullWidget  whenDrag={this.handleDragEv.bind(this)} data={WidgetList.widget3} wd="widget3" candrag="true"/>


         },
         widget4: {
            clType: "col-xs-6 widget-box",
            colType: 6,
            style: {},
            shown: true,
            holdType: "FullWidget",
            data: WidgetList.widget4,
            comp: <FullWidget  whenDrag={this.handleDragEv.bind(this)} data={WidgetList.widget4} wd="widget4" candrag="true"/>
         }

      }
      this.dropHandle = this.dropHandle.bind(this);
      this.handleDragEv = this.handleDragEv.bind(this);
      this.dragEnter = this.dragEnter.bind(this);
      this.dragLeave = this.dragLeave.bind(this);
   };
   dropHandle(widgetNum) {
      let droppedWid = this.state.draggedWidget;
      console.log('targetWid', WidgetList[widgetNum]);
      console.log('droppedWid', droppedWid);
      let stateOB = {};
      stateOB[widgetNum] = this.state[widgetNum];
      let dropData = this.state[droppedWid].data;
      let targetData = this.state[widgetNum].data;
      stateOB[widgetNum].data = dropData;
      stateOB[widgetNum].comp = <FullWidget  whenDrag={this.handleDragEv.bind(this)} data={dropData} wd={widgetNum} candrag="true"/>
      stateOB[droppedWid] = this.state[droppedWid];
      stateOB[droppedWid].data = targetData;
      stateOB[droppedWid].comp = <FullWidget  whenDrag={this.handleDragEv.bind(this)} data={targetData} wd={droppedWid} candrag="true"/>
      WidgetList[droppedWid] = stateOB[droppedWid].data;
      WidgetList[widgetNum] = stateOB[widgetNum].data;
      stateOB.draggedWidget = null;
      this.setState(stateOB);

   };
   handleDragEv(widget, data) {
      console.log('widget', widget);
      console.log('widget data', data);

      this.setState({
         draggedWidget: widget
      });
   };
   onDragOver(e) {
      e.preventDefault();

   }
   dragEnter(e) {
      e.preventDefault();
      e.stopPropagation();


   };
   dragLeave(e) {
      e.preventDefault();
      e.stopPropagation();

   };
   componentWillMount() {

   }
   render() {

      return (<div className="container-fluid wrapper"> 
                <div className="row" style={this.state.rowTop}>
                    <div 
                    className={this.state.widget1.shown ? this.state.widget1.clType : "hide-elm"}
                    data-w="widget1"
                    onDrop={this.dropHandle.bind(this, "widget1")}
                    onDragOver={this.dragEnter.bind(this)}>
                       {this.state.widget1.comp}
                    </div>
                    <div className={this.state.widget2.shown ? this.state.widget2.clType : "hide-elm"}
                    data-w="widget2"
                    onDrop={this.dropHandle.bind(this, "widget2")}
                    onDragOver={this.dragEnter.bind(this)}>
                     {this.state.widget2.comp}
                    </div>
                </div>   
                <div className="row" style={this.state.rowBtm}>
                    <div className={this.state.widget3.shown ? this.state.widget1.clType : "hide-elm"}
                    data-w="widget3"
                    onDrop={this.dropHandle.bind(this, "widget3")} 
                    onDragOver={this.dragEnter.bind(this)} >
                     {this.state.widget3.comp}
                    </div>
                    <div className={this.state.widget4.shown ? this.state.widget2.clType : "hide-elm"}
                    data-w="widget4"
                    onDrop={this.dropHandle.bind(this, "widget4")}
                    onDragOver={this.dragEnter.bind(this)}>
                     {this.state.widget4.comp}
                    </div>
                </div> 
            </div>)
   }
};