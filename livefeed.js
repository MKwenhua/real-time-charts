/**********
Note: This code is no longer in use, but I decided to keep it for
/*********/
const redis = require('redis');
const redisShare = redis.createClient();
const tickData = {};

redisShare.get('eur_usd_askbid', (err, resp) => {
  tickData.eur_usd_askbid = JSON.parse(resp);
});
redisShare.get('eur_usd_m1', (err, resp) => {
  tickData.eur_usd_m1 = JSON.parse(resp);
  tickData.len = tickData.eur_usd_m1.length;

});

module.exports = (io, userNrooms) => {
  const activeRooms = {};
  function liveStream(room, indexx, lastVal) {

    let yVal = tickData.eur_usd_m1[indexx][3];
    let theMin = tickData.eur_usd_m1[indexx][2];

    if (userNrooms[room].length > 0) {
      io.sockets. in(room).emit(room + '_Feed', {
        symb: room,
        data: tickData.eur_usd_m1[indexx],
        lastVal: lastVal,
        min: theMin
      });
    }
    let ind = (indexx + 1) < tickData.len ? indexx + 1 : 0;
    setTimeout(function () {
      liveStream(room, ind, yVal);
    }, 100);
  }

  function startRoom(roomName) {
    let lastVal = tickData.eur_usd_m1[tickData.len - 1][3];
    let theMin = tickData.eur_usd_m1[0][2];
    io.sockets. in(roomName).emit(roomName + '_Feed', {
      symb: roomName,
      data: tickData.eur_usd_m1[0],
      lastVal: lastVal,
      min: theMin
    });
    setTimeout(function () {
      liveStream(roomName, 0);
    }, 100);
  }
  return {
    activeRooms: activeRooms,
    newStream: (rmName) => {
      activeRooms[rmName] = true;
      console.log('this.activeRooms', activeRooms);
      startRoom(rmName);
    }

  }

};
