const Client = require('node-rest-client').Client;
const resty  = new Client();
const exchanges = {}
/*
redisShare.get('NASDAQ',(err, reply) => {
		//exchanges['NASDAQ'] = reply;
		Object.assign(exchanges, JSON.parse(reply)); 
});
redisShare.get('NYSE',(err, reply) => {
		//exchanges['NYSE'] = JSON.parse(reply);
		Object.assign(exchanges, JSON.parse(reply));
		//console.log('exchanges',exchanges);
});*/
module.exports =   {
   getData: function(symb, cb){
    let theURL = ["http://marketdata.websol.barchart.com/getHistory.json?key=",process.env.marketDataKEY,"&symbol=" ,symb, "&type=daily&startDate=20150704000000"].join("");
   	resty.get(theURL , function (data, response) {
			cb(data);
			
		});
   },
   getDataCB: function(symb,cb){
    let theURL = ["http://marketdata.websol.barchart.com/getHistory.json?key=",process.env.marketDataKEY,"&symbol=" ,symb, "&type=daily&startDate=20150704000000"].join("");
   	resty.get(theURL , function (data, response) {
			cb(JSON.stringify(data));
			
		});
   }
};
 
