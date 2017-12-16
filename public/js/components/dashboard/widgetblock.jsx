import React from "react";
import {connect} from "react-redux";
import FullWidget from "./widgets/fullwidget";
import DATASOURCE from "data/datasource";

@connect((store) => {
   return {widgets: store.widgets}
})

export default class WidgetBlock extends React.Component {
   constructor(props) {
      super(props);
      this.dbSource = DATASOURCE;

      this.getMessage = this.getMessage.bind(this);
      this.dropHandle = this.dropHandle.bind(this);
      this.handleDragEv = this.handleDragEv.bind(this);
      this.dragEnter = this.dragEnter.bind(this);
      this.dragLeave = this.dragLeave.bind(this);
      this.gotData = this.gotData.bind(this);
   };
   updateWidget(dta) {}
   getMessage(mess, wid) {
      let newWait = {};
      newWait[mess] = wid;
      this.props.dispatch({type: "GOT_MESSAGE", payload: newWait})
      this.dbSource.getMarketDataXHR(mess, this.gotData);
   }
   dropHandle(widgetNum) {
      let {WidgetList} = this.props.widgets;
      let droppedWid = this.props.widgets.draggedWidget;
      console.log('targetWid', WidgetList[widgetNum]);
      console.log('droppedWid', droppedWid);
      let stateOB = Object.assign({}, this.props.widgets);
      stateOB[widgetNum] = this.props.widgets[widgetNum];
      let dropData = this.props.widgets[droppedWid].data;
      let targetData = this.props.widgets[widgetNum].data;
      stateOB[widgetNum].data = dropData;

      stateOB[droppedWid] = this.props.widgets[droppedWid];
      stateOB[droppedWid].data = targetData;
      WidgetList[droppedWid] = stateOB[droppedWid].data;
      WidgetList[widgetNum] = stateOB[widgetNum].data;
      stateOB['WidgetList'] = WidgetList;
      stateOB.draggedWidget = null;
      this.props.dispatch({type: "WIDGET_DROP", payload: stateOB});

   };
   handleDragEv(widget, data) {

      this.props.dispatch({type: "WIDGET_DRAGGED", payload: widget});

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
   gotData(details) {
      let {WidgetList} = this.props.widgets;
      let needsUpdate = this.props.widgets.needsUpdate;
      console.log('needsUpdate', needsUpdate);
      let needsKey = details.results[0].symbol;
      let widgetNum = needsUpdate[needsKey];

      WidgetList[widgetNum].content.data = details.results;
      let stateOB = Object.assign({}, this.props.widgets);

      stateOB.needsUpdate = Object.keys(this.props.widgets.needsUpdate).reduce((obb, itm) => {
         if (itm !== needsKey) {
            obb[itm] = needsUpdate[itm];
         }
         return obb;
      }, {});
      stateOB[widgetNum].data.content.data = details.results;
      stateOB['WidgetList'] = WidgetList;

      this.props.dispatch({type: "GOT_DATA", payload: stateOB});

   }
   componentDidMount() {}
   componentWillMount() {}
   render() {
      const {
         rowTopStyle,
         rowBtmStyle,
         widget1,
         widget2,
         widget3,
         widget4
      } = this.props.widgets;
      return (
         <div className="container-fluid wrapper">
            <div className="row" style={rowTopStyle}>
               <div className={widget1.shown ? widget1.clType : "hide-elm"} data-w="widget1" onDrop={this.dropHandle.bind(this, "widget1")} onDragOver={this.dragEnter.bind(this)}>

                  <FullWidget inView={this.props.inView} ms={this.getMessage.bind(this)} whenDrag={this.handleDragEv.bind(this)} data={widget1.data} wd="widget1" candrag="true"/>
               </div>
               <div className={widget2.shown ? widget2.clType : "hide-elm"} data-w="widget2" onDrop={this.dropHandle.bind(this, "widget2")} onDragOver={this.dragEnter.bind(this)}>

                  <FullWidget inView={this.props.inView} ms={this.getMessage.bind(this)} whenDrag={this.handleDragEv.bind(this)} data={widget2.data} wd="widget2" candrag="true"/>
               </div>
            </div>
            <div className="row" style={rowBtmStyle}>
               <div className={widget3.shown ? widget3.clType : "hide-elm"} data-w="widget3" onDrop={this.dropHandle.bind(this, "widget3")} onDragOver={this.dragEnter.bind(this)}>

                  <FullWidget inView={this.props.inView} ms={this.getMessage.bind(this)} whenDrag={this.handleDragEv.bind(this)} data={widget3.data} wd="widget3" candrag="true"/>
               </div>
               <div className={widget4.shown ? widget4.clType : "hide-elm"} data-w="widget4" onDrop={this.dropHandle.bind(this, "widget4")} onDragOver={this.dragEnter.bind(this)}>
                  <FullWidget inView={this.props.inView} ms={this.getMessage.bind(this)} whenDrag={this.handleDragEv.bind(this)} data={widget4.data} wd="widget4" candrag="true"/>
               </div>
            </div>
         </div>
      )
   }
};
