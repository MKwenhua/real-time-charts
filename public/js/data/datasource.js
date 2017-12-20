import xhr from 'xhr';

class DATASOURCE {
  constructor(instanceName = 'Default') {
    this.instanceName = instanceName;
  }
  xhrGet(route, cb) {
    const theURL = '/xhrs/' + route;

    const request = new XMLHttpRequest();
    request.open('GET', theURL, true);
    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        const resp = request.responseText;
        cb(JSON.parse(resp));
      }
    };
    request.onerror = () => {
      console.log('things happened');
    };
    request.send();

  }
  xhrPost(route, data, cb) {
    const theURL = '/xhrs/' + route;
    xhr({
      body: JSON.stringify(data),
      uri: theURL,
      headers: {
        'Content-Type': 'application/json'
      }
    }, (err, resp, body) => cb(JSON.parse(body)))
  };

  getRealTimeXHR = (cb) => {
    this.xhrGet('getusers', cb);
  }
  getListTypeXHR = (param, cb) => {
    console.log('used sockets for getListType');
    const route = 'listparams/' + param;
    this.xhrGet(route, cb);
  }

  getIndicatorXHR = (country, cb) => {
    const route = 'indicator/' + country;
    this.xhrGet(route, cb);
  }
  getMarketDataXHR = (symbol, cb) => {
    const route = 'marketdata/' + symbol.toUpperCase();
    this.xhrGet(route, cb);
  }
}

export default new DATASOURCE('main');
