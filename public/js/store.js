import {compose, createStore, applyMiddleware, combineReducers} from 'redux';
import logger from 'redux-logger'

import reducer from './reducers'
const composedStore = compose(applyMiddleware(logger()));

export default composedStore(createStore)(reducer)
