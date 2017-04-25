//import io from 'socket.io-client';

import xhr from "xhr";
function DATASOURCE(instanceName = "Default") {
   let notTest = document.getElementById('hasCsrf');
   this.csrfToken = notTest ? notTest.dataset.csrf : "zzz7s7s7s";
   let self = this;
   function xhrGet(route, cb) {
      var theURL = '/xhrs/' + route;

      var request = new XMLHttpRequest();
      request.open('GET', theURL, true);
      request.setRequestHeader('X-CSRF-Token', self.csrfToken);
      request.onload = function () {
         if (request.status >= 200 && request.status < 400) {
            var resp = request.responseText;

            cb(JSON.parse(resp));
         } else {}
      };
      request.onerror = function () {
         console.log('things happened');
      };
      request.send();

   };
   function xhrPost(route, data, cb) {
      var theURL = '/xhrs/' + route;

      xhr({
         body: JSON.stringify(data),
         uri: theURL,
         headers: {
            "Content-Type": "application/json"
         }
      }, function (err, resp, body) {
         cb(JSON.parse(body));
      })
   };

   this.instanceName = instanceName;

   this.getRealTimeXHR = function (cb) {
      xhrGet('getusers', cb);
   };
   this.getListTypeXHR = function (param, cb) {
      console.log('used sockets for getListType');
      var route = 'listparams/' + param;
      xhrGet(route, cb);

   };
   /*
  this.getRealTimeFeed = function() {
    console.log('used sockets for getUsers');
    this.socket.emit('getUsers', {ok: 'give me user list please'});
  };
  this.getIndicatorSockets = function(country) {
  	this.socket.emit('getIndicators', {ct: country, sock: DATASOURCE.prototype.socketID});
  }
  this.getMarketDataSockets = function(symbol) {
  	this.socket.emit('getHistory', {company: symbol.toUpperCase(), sock: DATASOURCE.prototype.socketID});
  }
  this.getMarketDataMultiSockets = function(symbol) {
  	this.socket.emit('getHistoryM', {company: symbol.toUpperCase(), sock: DATASOURCE.prototype.socketID});
  }
  this.startLiveFeed = function(symbol) {
  	this.socket.emit('startLiveFeed', symbol);
  };
  */
   this.getIndicatorXHR = function (country, cb) {
      var route = 'indicator/' + country;
      xhrGet(route, cb);

   }
   this.getMarketDataXHR = function (symbol, cb) {
      var route = 'marketdata/' + symbol.toUpperCase();
      xhrGet(route, cb);

   }

}
//DATASOURCE.prototype.csrfToken = document.getElementById('hasCsrf').dataset.csrf;
/*
//DATASOURCE.prototype.socket = io('https://rtcharts-scgraph.rhcloud.com:8443',{'forceNew':false,'reconnect': false, transports:['websocket'] });
DATASOURCE.prototype.socket = io('http://localhost:8443',{'forceNew':false,'reconnect': false, transports:['websocket'] });
//DATASOURCE.prototype.gosock = new WebSocket("wss://damp-beyond-64138.herokuapp.com/ws");

DATASOURCE.prototype.connected = false;
DATASOURCE.prototype.socketID = null;
DATASOURCE.prototype.retryNums = 0;
DATASOURCE.prototype.retry = true;
DATASOURCE.prototype.socket.on('connect',  (details) => {
  DATASOURCE.prototype.connected = true;

});
DATASOURCE.prototype.socket.on('disconnect',  (details) => {
  DATASOURCE.prototype.connected = false;
  if (DATASOURCE.prototype.retry) {
     // DATASOURCE.prototype.socket = io('https://rtcharts-scgraph.rhcloud.com:8443',{'forceNew':false,'reconnect': false, transports:['websocket'] });
  	DATASOURCE.prototype.socket = io('http://localhost:8443',{'forceNew':false,'reconnect': false, transports:['websocket'] });
   }
});
DATASOURCE.prototype.socket.on('connect_error', (details) => {
	console.log('connect error ', details);
	DATASOURCE.prototype.retryNums += 1;
	if( !DATASOURCE.prototype.connected && DATASOURCE.prototype.retryNums > 1) {
   	DATASOURCE.prototype.socket.io.reconnection(false);
   	console.log('discnnected');
    DATASOURCE.prototype.socket = null;
    DATASOURCE.prototype.retry = false;


   }
});

DATASOURCE.prototype.socket.on('newInstance',  (details) => {
  DATASOURCE.prototype.socketID = details.sockId;
  console.log('DATASOURCE.prototype.socketID ', DATASOURCE.prototype.socketID );
});

*/
module.exports = new DATASOURCE('main');
