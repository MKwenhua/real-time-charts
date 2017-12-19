const urlBase = false ? '127.0.0.1:8000/ws' : 'damp-beyond-64138.herokuapp.com/ws';

const OpenWebsocket = () => {
  const theSocketUrl = window.location.protocol !== 'https:' ? 'ws://' + urlBase : 'wss://' + urlBase;

  const SOCKET = new WebSocket(theSocketUrl);
  SOCKET.on = {};
  SOCKET.watchedFeeds = {}
  SOCKET.dispatchEvent = (name, callback) => {
    SOCKET.on[name] = callback;
  }

  SOCKET.onmessage = (event) => {
    const theData = JSON.parse(event.data);
    if (!SOCKET.watchedFeeds[theData.symb]) {
      SOCKET.watchedFeeds[theData.symb] = true;
      SOCKET.on.liveFeedStarted(theData.symb);
    }
    SOCKET.on[theData.symb](theData);
  }
  return SOCKET;
}

export default OpenWebsocket;
