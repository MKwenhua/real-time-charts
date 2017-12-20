require('dotenv').config()
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const ejs = require('ejs');
const app = new express();
const bodyParser = require('body-parser');
const csrf = require('csurf');
const http = require('http');
const path = require('path');
const contentTypes = require('./utils/content-types');
const sysInfo = require('./utils/sys-info');
const env = process.env;
const socketio = require('socket.io');
const redis = require('redis');
const sio_redis = require('socket.io-redis');
const inLocal = true;
const redisPort = inLocal ? 6379 : 16379;
const redisAddress = inLocal ? '127.0.0.1' : '127.9.140.2';
const sub = redis.createClient(redisPort, redisAddress, {return_buffers: true});
const pub = redis.createClient(redisPort, redisAddress, {return_buffers: true});
const marketData = require('./marketdata.js');
const tradingEcon = require('./tradingecon.js');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.enable('trust proxy');
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.set('views', __dirname + '/public');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');


app.get('/health', (req, res) => {
  res.writeHead(200);
  res.end();
});

app.get(/\/info\/(gen|poll)/, (req,res) => {
    let url = req.url;
	  res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[url.slice(6)]()));
});

app.get('/', (req,res) => {
  res.render('start',{
    csrfToken: req.csrfToken()
  });
});
app.get(/\/(history|map|realtime)/, (req,res) => {
  res.render('start',{
    csrfToken: req.csrfToken()
  });
});

app.get('/xhrs/marketdata/:symbol',  (req,res) => {
    let symbol = req.params.symbol
    console.log('xhr marketdata', symbol);
    marketData.getDataCB( symbol , (data) => {
    	res.send(data);
    	res.end();
    });
});
app.get('/xhrs/indicator/:country',  (req,res) => {
    let country = req.params.country
    console.log('xhr indicator', country);
    tradingEcon.getDataIndicatorsCB( country , (data) => {
    	res.send(JSON.stringify(data));
    	res.end();
    });
});

let server = app.listen(env.NODE_PORT || 8443, env.NODE_IP || 'localhost', () => {
  console.log(`Application worker ${process.pid} started...`);
});

const io = socketio(server);

var setAdapter = (() => {
  var num = 0;
  return function() {
    num += 1;
    console.log('num', num);
    if (num > 1) {
      io.adapter(sio_redis({
        pubClient: pub,
        subClient: sub
      }));
    }
  }
})();
if (inLocal) {
  setAdapter();
  setAdapter();
} else {
sub.auth(env.REDIS_PW , (err) => {
  if (err) {
    console.log(err)
  };
  setAdapter();
});

pub.auth(env.REDIS_PW , (err) => {
  if (err) {
    console.log(err)
  };
  setAdapter();
});
}


io.on('connection', (socket) => {

  socket.emit('newInstance', { sockId: socket.id  });
  socket.on('getHistory', (symbl) => {
  	marketData.getData(symbl.company, (data) => {
  		io.to(socket.id).emit('marketData',data);
  	});
  });

  socket.on('disconnect', function() {
      console.log('Got disconnected!');
  });
  socket.on('getHistoryM', (symbl) => {
  	marketData.getData(symbl.company, (data) => {
  		io.to(socket.id).emit('dataLookup',data);
  	});
  });
  socket.on('getIndicators', (cntry) => {
  					let ct = cntry.ct;
  	tradingEcon.getDataIndicatorsCB(ct, (data) => {

  		io.to(socket.id).emit('indicatorData',data);
  	});
  });

});
