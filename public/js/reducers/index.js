import { combineReducers } from "redux"

import rt from "./dashboardReducer"
import trades from "./tradeReducer"

export default combineReducers({
  rt,
  trades, 
})