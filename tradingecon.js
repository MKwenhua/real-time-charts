const fs = require('fs');
const redis = require('redis');
const request = require('request');
const cheerio = require('cheerio');
const redisShare = redis.createClient(17129, process.env.REDIS_ENDPOINT);

redisShare.auth(process.env.REDIS_LABS_PW, (err) => {
  if (err) {
    console.log(err)
  };
});
redisShare.on('connect', (err) => {
  console.log('Connected to Redis');
});

//["http://www.tradingeconomics.com/",,"/gdp-growth"]
//["http://www.tradingeconomics.com/china/inflation-cpi"]
const Urls = [
  "http://www.tradingeconomics.com/country-list/gdp-per-capita",
  "http://www.tradingeconomics.com/country-list/gdp-growth-rate",
  "http://www.tradingeconomics.com/country-list/gdp-annual-growth-rate",
  "http://www.tradingeconomics.com/country-list/interest-rate",
  "http://www.tradingeconomics.com/country-list/inflation-rate",
  "http://www.tradingeconomics.com/country-list/unemployment-rate",
  "http://www.tradingeconomics.com/country-list/government-debt-to-gdp",
  "http://www.tradingeconomics.com/country-list/gdp",
  "http://www.tradingeconomics.com/country-list/gdp-per-capita",
  "http://www.tradingeconomics.com/country-list/population",
  "http://www.tradingeconomics.com/country-list/productivity",
  "http://www.tradingeconomics.com/country-list/balance-of-trade",
  "http://www.tradingeconomics.com/country-list/current-account-to-gdp",
  "http://www.tradingeconomics.com/country-list/crude-oil-production",
  "http://www.tradingeconomics.com/country-list/foreign-exchange-reserves",
  "http://www.tradingeconomics.com/country-list/rating",
  "http://www.tradingeconomics.com/country-list/corporate-tax-rate",
  "http://www.tradingeconomics.com/country-list/personal-income-tax-rate",
  "http://www.tradingeconomics.com/country-list/retirement-age-men",
  "http://www.tradingeconomics.com/country-list/retirement-age-women",
  "http://www.tradingeconomics.com/forecast/population",
  "http://www.tradingeconomics.com/forecast/gdp-per-capita"
];

const reduceRows = (elTXT, keyArr) => {
  return formatText(elTXT).reduce((oo, itm, k) => {
    oo[keyArr[k]] = itm;
    return oo;
  }, {});
}

const formatText = (txt) => txt.trim().split(/\s+/g);

const createTable = (thead) => {
  return {tableHead: formatText(thead), rows: []}
}

function scrapeIndicators(country, cb, keyy) {
  let url = 'http://www.tradingeconomics.com/' + country + '/indicators';
  request(url, function (error, response, html) {
    if (error) {
      console.log(error)
    }
    let tables = [];
    let $ = cheerio.load(html);

    $('div[role="main"]').find('table').each(function (i, elem) {
      let table = [];
      $(elem).children().each((c, ee) => {

        if (ee.tagName === "thead") {
          table.push(createTable($(ee).text()));
        }

        if (ee.tagName === "tr") {
          let keyMap = table[table.length - 1].tableHead;
          let newRow = {};
          $(ee).find('td').each((ii, el) => {
            if (keyMap[ii]) {
              newRow[keyMap[ii]] = $(el).text().trim().replace(/\s\s+/g, '');
            }
          });
          table[table.length - 1].rows.push(newRow);

        }

      });
      tables.push(table);

    });
    redisShare.set(keyy, JSON.stringify(tables), (err, reply) => {
      if (!err) {
        cb(tables);
        redisShare.expireat(keyy, parseInt((+ new Date) / 1000) + 86400);
      }
    });

  });
};

function getIndicator(country, cb) {
  let keyy = country + '_indicators';
  redisShare.get(keyy, (err, reply) => {
    if (reply) {
      cb(reply);
    } else {
      scrapeIndicators(country, cb, keyy);
    }

  });

}
module.exports = {
  getDataIndicatorsCB: getIndicator
}
