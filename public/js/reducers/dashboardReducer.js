const React = require('react');

const innitialState = {
   onStart: true,
   chart1: null,
   chart2: null,
   chart3: null,
   chart4: null,
   chartPositions: {},
   chartAddOpen: false,
   selectUl: "forex",
   totalCharts: 0,
   addButton: false,
   optsComponent: null,
   newSet: null,
   platformView: "live graphs",
   tradViewClass: "full-view",
   chartClass: ["chart-box-100 col-sm-12", "chart-box-50 col-sm-12"],
   chartSlots: ['chart1', 'chart2', 'chart3', 'chart4'],
   connected: false,
   charts: {},
   seriesWatch: []
}


export default function reducer(state = innitialState, action) {

   switch (action.type) {
      case "ADD_CHART":
         {

            return action.payload
            break;

         }
      case "CLOSE_CHART":
         {

            return action.payload
            break;
         }
      case "FEED_START":
         {
            return {...state,
               seriesWatch: action.payload.seriesWatch,
               addButton: action.payload.addButton
            }
            break;
         }
      case "OPTS_VIEW":
         {
            return {...state,
               tradViewClass: action.payload.tradViewClass,
               optsComponent: action.payload.optsComponent,
               platformView: action.payload.platformView
            }
            break;
         }
      case "SWITCH_INDICES":
         {
            return {...state,
               selectUl: action.payload
            }
            break;
         }
      case "TOGGLE_CHART_MENU":
         {
            return {...state,
               chartAddOpen: action.payload
            }
            break;
         }
      case "CONNECTION_LOST":
         {

            return {...state,
               connected: false
            }
            break;
         }
      case "CONNECTED":
         {
            return {...state,
               connected: true
            }
            break;
         }

   }

   return state
}