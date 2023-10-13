require('dotenv').config();

var axios = require('axios');
var crypto = require('crypto');

const apiSecret = process.env.SECRET_KEY;
const apiKey = process.env.API_KEY;
const url = process.env.URL;


function signature(query_string) {
  return crypto
    .createHmac('sha256', apiSecret)
    .update(query_string)
    .digest('hex');
}


module.exports.getPrice = async (symbol) => {
  let price;

  var config = {
    method: 'get',
    url: `${url}/ticker/price?symbol=${symbol}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  await axios(config)
    .then(function (response) {
      price = response.data.price;
    })
    .catch(function (error) {
      console.log('get price error : ', error);
    });

  return price;
}



module.exports.getAllPairs = async () => {

  let data;

  var config = {
    method: 'get',
    url: `${url}/exchangeInfo`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  await axios(config)
    .then(function (response) {
      data = response.data.symbols;
    })
    .catch(function (error) {
      console.log(error);
    });

  return data;
}



module.exports.getMinNotional = async (symbol) => {

  let data;

  var config = {
    method: 'get',
    url: `${url}/exchangeInfo?symbol=${symbol}`,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  await axios(config)
    .then(async function (response) {
      var symbols = response.data.symbols;

      var filters = symbols[0].filters;

      await filters.map(filter => {
        if (filter.filterType == 'MIN_NOTIONAL') {
          minNotional = filter.minNotional;
        } else if (filter.filterType == 'LOT_SIZE') {
          minQtyGiven = filter.minQty;
          stepSize = filter.stepSize;
        }
      })

      data = {
        minNotional: minNotional,
        minQtyGiven: minQtyGiven,
        stepSize: stepSize
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  return data;
}



module.exports.getAssets = async (symbol) => {

  let utcTimestamp = new Date().getTime();

  let query_string = `timestamp=${utcTimestamp}`;

  let sign = await signature(query_string);

  let assetData;

  var config = {
    method: 'get',
    url: `${url}/account?timestamp=${utcTimestamp}&signature=${sign}`,
    headers: {
      'Content-Type': 'application/json',
      'X-MBX-APIKEY': apiKey
    }
  };

  await axios(config)
    .then(async function (response) {
      if (response.data) {
        let balance = response.data.balances;

        if (symbol == null) {
          assetData = balance;
        } else {

          await balance.map(data => {
            if (data.asset == symbol) {
              console.log('User Asset to Trade(info)', data.asset, ' : ', data.free);
              assetData = data.free;
            }
          })
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  return assetData;
}
