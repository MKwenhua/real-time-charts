import React from 'react';
import {connect} from 'react-redux';
import FullWidget from './widgets/fullwidget';
import DATASOURCE from 'data/datasource';
import {
  WIDGET_DROP,
  WIDGET_DRAGGED,
  GOT_MESSAGE,
  GOT_DATA
}  from 'constants/widgets'



function select(store) {
  // How Different Redux stores get mapped to props
  return {widgets: store.widgets}
}

class WidgetBlock extends React.PureComponent {
   constructor(props) {
      super(props);
      this.dbSource = DATASOURCE;
   };
   updateWidget = (dta) => {}
   getMessage = (mess, wid) => {
      let newWait = {};
      newWait[mess] = wid;
      this.props.dispatch({type: GOT_MESSAGE, payload: newWait})
      this.dbSource.getMarketDataXHR(mess, this.gotData);
   }
   dropHandle = (widgetNum) => () => {
      const { draggedWidget } = this.props.widgets;
      const stateCopy = Object.assign({}, this.props.widgets,
        {
          draggedWidget: null,
          WidgetList: Object.assign({}, this.props.widgets.WidgetList)
        })
      stateCopy.WidgetList[draggedWidget] =  this.props.widgets[draggedWidget].data;
      stateCopy.WidgetList[widgetNum] = this.props.widgets[widgetNum].data;

      stateCopy[draggedWidget] = this.props.widgets[widgetNum];
      stateCopy[widgetNum] = this.props.widgets[draggedWidget];

      this.props.dispatch({type: WIDGET_DROP, payload: stateCopy});

   };
   handleDragEv = (widget, data) => {

      this.props.dispatch({type: WIDGET_DRAGGED, payload: widget});

   };
   onDragOver(e){
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
   gotData = (details) => {
      const { WidgetList, needsUpdate } = Object.assign({},this.props.widgets);
      console.log('needsUpdate', needsUpdate);
      const needsUpdateKey = details.results[0].symbol;
      let widgetNum = needsUpdate[needsUpdateKey];

      WidgetList[widgetNum].content.data = details.results;

      const stateUpdates = {
        WidgetList,
        needsUpdate: Object.keys(needsUpdate).reduce((obb, itm) => {
           if (itm !== needsUpdateKey) {
              obb[itm] = needsUpdate[itm];
           }
           return obb;
        }, {})
      }

      this.props.dispatch({type: GOT_DATA, payload: stateUpdates});

   }
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
         <div className='container-fluid wrapper'>
            <div className='row' style={rowTopStyle}>
               <div className={widget1.shown ? widget1.clType : 'hide-elm'} data-w='widget1' onDrop={this.dropHandle('widget1')} onDragOver={this.dragEnter}>
                  <FullWidget inView={this.props.inView} ms={this.getMessage} whenDrag={this.handleDragEv} data={widget1.data} wd='widget1' candrag={true}/>
               </div>
               <div className={widget2.shown ? widget2.clType : 'hide-elm'} data-w='widget2' onDrop={this.dropHandle('widget2')} onDragOver={this.dragEnter}>
                  <FullWidget inView={this.props.inView} ms={this.getMessage} whenDrag={this.handleDragEv} data={widget2.data} wd='widget2' candrag={true}/>
               </div>
            </div>
            <div className='row' style={rowBtmStyle}>
               <div className={widget3.shown ? widget3.clType : 'hide-elm'} data-w='widget3' onDrop={this.dropHandle('widget3')} onDragOver={this.dragEnter}>
                  <FullWidget inView={this.props.inView} ms={this.getMessage} whenDrag={this.handleDragEv} data={widget3.data} wd='widget3' candrag={true}/>
               </div>
               <div className={widget4.shown ? widget4.clType : 'hide-elm'} data-w='widget4' onDrop={this.dropHandle('widget4')} onDragOver={this.dragEnter}>
                  <FullWidget inView={this.props.inView} ms={this.getMessage} whenDrag={this.handleDragEv} data={widget4.data} wd='widget4' candrag={true}/>
               </div>
            </div>
         </div>
      )
   }
};

export default connect(select)(WidgetBlock);
