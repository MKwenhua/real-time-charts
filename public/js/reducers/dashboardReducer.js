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
  seriesWatch: []
}

export default function reducer(state = innitialState, action) {
  switch (action.type) {
    case 'ADD_CHART': {
        return {
          ...state,
          ...action.payload
        }
      }
    case 'CLOSE_CHART': {
        return action.payload
      }
    case 'WATCHED_POSITIONS': {
        return action.payload
      }
    case 'RESET_CHARTS': {
        return action.payload
      }
    case 'FEED_START': {
        return {
          ...state,
          seriesWatch: action.payload.seriesWatch,
          addButton: action.payload.addButton
        }
      }
    case 'OPTS_VIEW': {
        return {
          ...state,
          tradViewClass: action.payload.tradViewClass,
          optsComponent: action.payload.optsComponent,
          platformView: action.payload.platformView
        }
      }
    case 'SWITCH_INDICES': {
        return {
          ...state,
          selectUl: action.payload
        }
      }
    case 'TOGGLE_CHART_MENU': {
        return {
          ...state,
          chartAddOpen: action.payload
        }
      }
    case 'CONNECTION_LOST': {
        return {
          ...state,
          connected: false
        }
      }
    case 'CONNECTED': {
        return {
          ...state,
          connected: true
        }
      }
  }

  return state
}
