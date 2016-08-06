import React from "react";


import Graph from "./components/graph";
import RealTime from "./components/realtime";
import Map from "./components/map";

const _applyListener = function(type) {
    var histFunc = history[type];
    return function() {
        var rv = histFunc.apply(this, arguments);
        var e = new Event(type);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
 
window.checkPath = (() => {
  	const allPaths =  ['/', '/history', '/realtime','/map'];

	const allTitles = {
		'/': 'Examples',
		'/history': 'History',
		'/realtime': 'Real Time',
		'/map': 'Map Stuff'
	};

	const ChangeUrl = (title, url) => {
	  	if (typeof (history.pushState) === "undefined") return ; 
	  	let obj = { Title: title, Url: url };
	  	history.pushState(obj, obj.Title, obj.Url);
	};

	
	return (path) => {
		let pathIS = allPaths.reduce((q,i) => { return i === path ?  i : q; },"/" );
		ChangeUrl(allTitles[pathIS], pathIS);
		return pathIS;
	}
})(); 

export default class Layout extends React.Component {
	
	constructor() {
		super();
			history.pushState = _applyListener('pushState');
			window.onpopstate = (e) => {
				console.log( e);
				let newPath = e.state.Url;
				this.setState({pathName: newPath, blocked: this.routeComponents[newPath]});
			};
		    const eventHandler =  (() => {
		    	const thisScope = this;
		    	return (e) => {
		    		console.log('State Changed!', e);
		    		let newPath = e.arguments[0].Url;
		    		thisScope.setState({pathName: newPath, blocked: thisScope.routeComponents[newPath]});
		    	}
		    })();

			window.addEventListener('pushState', eventHandler);
			this.routeComponents = {
				"/": (<Graph  /> ),
				"/history": (<Graph  />) ,
				"/realtime" : ( <RealTime  />),
				"/map" : (<Map />)
			}
			this.state = {
			  pathName: window.location.pathname,
			  blocked: this.routeComponents[window.checkPath(window.location.pathname)]
			}
		} 
	 	newSet (newPath) {	
			this.setState({pathName: newPath, blocked: this.routeComponents[newPath]});
		};

		setPath () {
		 	let len = 	window.location.pathname.match('/').length;
			let path = len === 1 ? '/' : window.location.pathname.replace('/', '');
		 	this.newSet(checkPath(window.location.pathname));
		};

		goState (pp) {
			window.checkPath(pp);
		}

	render() {
		
		return (
		<div>
			<nav  id="topNav" className={this.state.pathName === '/realtime' ? "rt-alter" : ""}>
				<span onClick={this.goState.bind(null,'/history')} className={(this.state.pathName === '/history' || this.state.pathName === '/') ? "blocked-at" : ""}>History</span>
				<span onClick={this.goState.bind(null,'/realtime')}  className={this.state.pathName === '/realtime' ? "blocked-at" : ""}>Real Time</span>
				<span onClick={this.goState.bind(null,'/map')}  className={this.state.pathName === '/map' ? "blocked-at" : ""}>Map Thing</span>
       		</nav> 
			{this.state.blocked}
		</div>
		);
	}
};