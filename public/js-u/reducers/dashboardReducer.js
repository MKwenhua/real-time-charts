import {
  ADD_CHART,
  CLOSE_CHART,
  WATCHED_POSITIONS,
  RESET_CHARTS,
  FEED_START,
  OPTS_VIEW,
  SWITCH_INDICES,
  TOGGLE_CHART_MENU,
  CONNECTION_LOST,
  CONNECTED
} from 'constants/action_types'

const innitialState = {
  onStart: true,
  chartPositions: {},
  chartAddOpen: false,
  selectUl: 'forex',
  totalCharts: 0,
  addButton: false,
  optsComponent: null,
  newSet: null,
  chartList: [],
  platformView: 'live graphs',
  tradViewClass: 'full-view',
  connected: false,
  seriesWatch: {}
}

export default function reducer(state = innitialState, action) {

  switch (action.type) {
    case ADD_CHART:
      {

        return action.payload
        break;

      }
    case CLOSE_CHART:
      {

        return action.payload
        break;
      }
    case WATCHED_POSITIONS:
      {

        return action.payload
        break;
      }
    case RESET_CHARTS:
      {

        return action.payload
        break;
      }
    case FEED_START:
      {
        return {
          ...state,
          seriesWatch: action.payload.seriesWatch,
          addButton: action.payload.addButton
        }
        break;
      }
    case OPTS_VIEW:
      {
        return {
          ...state,
          tradViewClass: action.payload.tradViewClass,
          optsComponent: action.payload.optsComponent,
          platformView: action.payload.platformView
        }
        break;
      }
    case SWITCH_INDICES:
      {
        return {
          ...state,
          selectUl: action.payload
        }
        break;
      }
    case TOGGLE_CHART_MENU:
      {
        return {
          ...state,
          chartAddOpen: action.payload
        }
        break;
      }
    case CONNECTION_LOST:
      {

        return {
          ...state,
          connected: false
        }
        break;
      }
    case CONNECTED:
      {
        return {
          ...state,
          connected: true
        }
        break;
      }

  }

  return state
}
