import xhr from 'xhr';

const csrfToken = (() => {
  let notTest = document.getElementById('hasCsrf');
  return notTest ? notTest.dataset.csrf : 'zzz7s7s7s';
})()

function xhrGet(route, cb) {
  let theURL = '/xhrs/' + route;

  const request = new XMLHttpRequest();
  request.open('GET', theURL, true);
  request.setRequestHeader('X-CSRF-Token', csrfToken);
  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      cb(JSON.parse(request.responseText));
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
      'Content-Type': 'application/json'
    }
  }, function (err, resp, body) {
    cb(JSON.parse(body));
  })
};

const DATASOURCE = {
  getRealTimeXHR: (cb) => {
    xhrGet('getusers', cb);
  },
  getListTypeXHR: (param, cb) => {
    console.log('used sockets for getListType');
    var route = 'listparams/' + param;
    xhrGet(route, cb);
  },
  getIndicatorXHR: (country, cb) => {
    let route = 'indicator/' + country;
    xhrGet(route, cb);
  },
  getMarketDataXHR: (symbol, cb) => {
    let route = 'marketdata/' + symbol.toUpperCase();
    xhrGet(route, cb);
  }
}

export default DATASOURCE;
