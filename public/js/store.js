import { compose, createStore, applyMiddleware, combineReducers } from 'redux';
import logger from "redux-logger"
//import thunk from "redux-thunk"
//import promise from "redux-promise-middleware"

import reducer from "./reducers"

//const middleware = applyMiddleware(promise(), thunk, logger())
//const middleware = applyMiddleware(promise())
 const composedStore = compose(
    applyMiddleware(logger()),
  );

 export default  composedStore(createStore)(reducer)
//export default createStore(reducer);
