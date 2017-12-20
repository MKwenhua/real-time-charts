import React from 'react';

import Graph from 'container/graph_temp';
import RealTime from 'container/realtime';
import Map from 'container/map';
import TopNav from 'container/topnav';
import {NEW_PATH} from 'constants/routes'

window.checkPath = (() => {

  const ChangeUrl = (title, url) => {
    if (typeof(history.pushState) === 'undefined') return;

    let obj = {
      Title: title,
      Url: url
    };
    history.pushState(obj, obj.Title, obj.Url);
  };
  const allPaths = ['/', '/history', '/realtime', '/map'];
  const allTitles = {
    '/': 'Examples',
    '/history': 'History',
    '/realtime': 'Real Time',
    '/map': 'Map Stuff'
  }
  const pathReducer = (path) => {};
  return (path) => {
    //  let routeArray = path.split('/').filter(Boolean);
    let pathIS = allPaths.reduce((q, i) => {
      return i === path ? i : q;
    }, '/');
    ChangeUrl(allTitles[pathIS], pathIS);
    return pathIS;
  }
})();

const routeComponents = {
  '/': (<Graph/>),
  '/history': (<Graph/>),
  '/realtime': (<RealTime/>),
  '/map': (<Map/>)
}
const getTopNav = {
  '/': (<TopNav theClass='normal' pathName='/'/>),
  '/history': (<TopNav theClass='normal' pathName='/history'/>),
  '/realtime': (<TopNav theClass='rt-alter' pathName='/realtime'/>),
  '/map': (<TopNav theClass='normal' pathName='/map'/>)
}
let initialPath = window.checkPath(window.location.pathname);
export default function reducer(state = {
  pathName: window.location.pathname,
  blocked: routeComponents[initialPath],
  topNav: <TopNav theClass={initialPath === '/realtime' ? 'rt-alter' : ''} pathName={initialPath}/>,
  routeComponents: routeComponents
}, action) {

  switch (action.type) {
    case NEW_PATH:
      {
        return {
          ...state,
          pathName: action.payload.pathname,
          blocked: action.payload.blocked,
          topNav: action.payload.topNav
        }
        break;

      }

  }

  return state
}
