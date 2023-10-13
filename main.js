require('dotenv').config();

var getDataFunc = require('./UtilFunctions/getData');
var checks = require('./UtilFunctions/check');
var trx = require('./UtilFunctions/transaction');
var symbol = require('./Schema/symbols.schema');

const percentageCheck = process.env.PRICE_DIFFERENCE_TO_CHECK;


module.exports.main = async () => {
    const allPairs = await symbol.Symbol.find();

    for (let i = 0; i < allPairs.length; i++) {

        let onePair = allPairs[i].baseAsset;

        let quoteAsset1 = allPairs[i].quoteAsset;

        let minNotional1, minQtyGiven1, stepSize1, minQty1, maxQtyGiven1;

        let symbol1Price = await getDataFunc.getPrice(allPairs[i].symbol);


        minNotional1 = allPairs[i].minNotional;
        minQtyGiven1 = allPairs[i].minQty;
        stepSize1 = allPairs[i].stepSize;
        maxQtyGiven1 = allPairs[i].maxQty;

        minQty1 = minNotional1 / symbol1Price;

        //console.log(allPairs[i].symbol,onePair , minNotional, minQtyGiven, stepSize)

        for (let j = i + 1; j < allPairs.length; j++) {

            let secondPair = allPairs[j].baseAsset;

            let quoteAsset2 = allPairs[j].quoteAsset;

            let minNotional2, minQtyGiven2, stepSize2, minQty2, symbol2Price, maxQtyGiven2;

            if (onePair == secondPair) {


                symbol2Price = await getDataFunc.getPrice(allPairs[j].symbol);


                minNotional2 = allPairs[j].minNotional;
                minQtyGiven2 = allPairs[j].minQty;
                stepSize2 = allPairs[j].stepSize;
                maxQtyGiven2 = allPairs[i].maxQty;

                minQty2 = minNotional2 / symbol2Price;

                if (minQty2 >= minQty1) {
                    let check2 = await checks.lotSizeCheck(minQty2, minQtyGiven2, stepSize2, maxQtyGiven2);
                    let check1 = await checks.lotSizeCheck(minQty2, minQtyGiven1, stepSize1, maxQtyGiven1);

                    if (check1 == 1 && check2 == 1) {

                        await this.transact(allPairs[i].symbol, allPairs[j].symbol, symbol1Price, symbol2Price, minQty2, quoteAsset1, quoteAsset2);
                    }
                } else {

                    let check2 = await checks.lotSizeCheck(minQty1, minQtyGiven2, stepSize2, maxQtyGiven2);
                    let check1 = await checks.lotSizeCheck(minQty1, minQtyGiven1, stepSize1, maxQtyGiven1);

                    if (check1 == 1 && check2 == 1) {
                        await this.transact(allPairs[i].symbol, allPairs[j].symbol, symbol1Price, symbol2Price, minQty1, quoteAsset1, quoteAsset2);
                    }
                }


                // console.log('......................');

                // console.log('Symbol1', allPairs[i].symbol, symbol1Price, minQty1);

                // console.log('Symbol2', allPairs[j].symbol, symbol2Price, minQty2);

                // console.log('......................');

            }



        }

    }

    console.log('Finished')
}








module.exports.transact = async (symbol1, symbol2, symbol1Price, symbol2Price, minQty, quoteAsset1, quoteAsset2) => {

    let minQty11;

    if (minQty < 1) {
        minQty11 = minQty + minQty;
    } else if (minQty < 10) {
        minQty11 = minQty + minQty / 10;
    } else if (minQty < 100) {
        minQty11 = minQty + minQty / 9;
    } else {
        minQty11 = minQty + minQty / 8;
    }



    if (minQty < 0.001) {
        minQty = minQty.toFixed(4);
        minQty11 = minQty11.toFixed(4);
    } else if (minQty < 0.01) {
        minQty = minQty.toFixed(3);
        minQty11 = minQty11.toFixed(3);
    } else if (minQty < 1) {
        minQty = minQty.toFixed(2);
        minQty11 = minQty11.toFixed(2);
    } else {
        minQty = Math.round(minQty);
        minQty11 = Math.round(minQty11);
    }




    let percentChange;

    if (symbol1Price > symbol2Price) {
        let diff = (symbol1Price - symbol2Price) / symbol1Price;

        diff = diff * 100;
        percentChange = diff.toFixed(2);
    } else {
        let diff = (symbol2Price - symbol1Price) / symbol2Price;

        diff = diff * 100;
        percentChange = diff.toFixed(2);
    }







    console.log('......................');

    console.log(symbol1, symbol1Price);
    console.log(symbol2, symbol2Price);

    console.log('......................');

    console.log('price difference :', percentChange, ' quantity : ', minQty11);

    console.log('......................');

    if (+percentChange >= +percentageCheck) {

        var pf = await checks.checkProfit(symbol1Price, symbol2Price, quoteAsset1, quoteAsset2, minQty11);

        console.log('profit percentage : ', pf);

        console.log('......................');

        if (pf !== 0) {

            await trx.transactionProcess(symbol1, symbol1Price, symbol2, symbol2Price, minQty11, quoteAsset1, quoteAsset2, pf)

        }

    } else {
        console.log('Transaction Failed', percentChange)
    }

}

