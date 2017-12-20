import { combineReducers } from 'redux';

import rt from './dashboardReducer';
import trades from './tradeReducer';
import widgets from './widgetReducer';
import routes from './routeReducer';
import transactions from './transactionReducer';

export default combineReducers({
  rt,
  trades,
  widgets,
  transactions,
  routes,
});
