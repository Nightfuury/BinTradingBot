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

module.exports.buy = async (symbol, quantity) => {
    let result;

    let utcTimestamp = new Date().getTime();

    let query_string = `symbol=${symbol}&side=BUY&type=MARKET&quantity=${quantity}&timestamp=${utcTimestamp}`;

    let sign = await signature(query_string);


    var config = {
        method: 'post',
        url: `${url}/order?symbol=${symbol}&side=BUY&type=MARKET&quantity=${quantity}&timestamp=${utcTimestamp}&signature=${sign}`,
        headers: {
            'Content-Type': 'application/json',
            'X-MBX-APIKEY': apiKey
        }
    };

    await axios(config)
        .then(function (response) {
            //console.log('Transaction (Buy) : ',symbol,response.data);

            result = {
                status: 1,
                response: response.data
            };
            //result = response.data;
        })
        .catch(function (error) {
            console.log('Transaction error : ', symbol, quantity, error.response.data.msg);

            result = {
                status: 0,
                response: error.response.data.msg
            };

            //result = "error";
        });
    return result;
}




module.exports.sell = async (symbol, quantity) => {
    let result;

    let utcTimestamp = new Date().getTime();

    let query_string = `symbol=${symbol}&side=SELL&type=MARKET&quantity=${quantity}&timestamp=${utcTimestamp}`;

    let sign = await signature(query_string);

    var config = {
        method: 'post',
        url: `${url}/order?symbol=${symbol}&side=SELL&type=MARKET&quantity=${quantity}&timestamp=${utcTimestamp}&signature=${sign}`,
        headers: {
            'Content-Type': 'application/json',
            'X-MBX-APIKEY': apiKey
        }
    };

    await axios(config)
        .then(function (response) {
            //console.log('Transaction(Sell) : ',symbol,response.data);

            result = {
                status: 1,
                response: response.data
            };

            //result = response.data;
        })
        .catch(function (error) {
            console.log('Transaction error : ', symbol, quantity, error.response.data.msg);

            result = {
                status: 0,
                response: error.response.data.msg
            };

            //result = "error";
        });
    return result;
}