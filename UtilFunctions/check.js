var getData = require('./getData');


module.exports.lotSizeCheck = (qty, minQtyGiven, stepSize, maxQtyGiven) => {

    let value = (qty - minQtyGiven) % stepSize;
    value = value.toFixed(1);

    if (value < 0.1 && qty >= minQtyGiven && qty <= maxQtyGiven) {
        return 1;
    } else {
        return 0;
    }
}



module.exports.checkProfit = async (symbol1Price, symbol2Price, quoteAsset1, quoteAsset2, qty) => {

    var profitPer;

    if (symbol1Price < symbol2Price) {

        profitPer = await symbol1Profit(symbol1Price, symbol2Price, quoteAsset1, quoteAsset2, qty);

    } else {

        profitPer = await symbol2Profit(symbol1Price, symbol2Price, quoteAsset1, quoteAsset2, qty);

    }

    return profitPer;
}




const symbol1Profit = async (symbol1Price, symbol2Price, quoteAsset1, quoteAsset2, qty) => {
    var quoteAsset1Spent, quoteAsset2Rec, conversionPrice, profit, profitPerc;

    quoteAsset1Spent = qty * symbol1Price;

    quoteAsset2Rec = qty * symbol2Price;

    if ((quoteAsset1 !== 'USDT' || quoteAsset1 !== 'BUSD') && (quoteAsset2 == 'USDT' || quoteAsset2 == 'BUSD')) {
        var symbol = quoteAsset1 + quoteAsset2;

        conversionPrice = await getData.getPrice(symbol);

        quoteAsset1Spent = quoteAsset1Spent * conversionPrice;

    } else if ((quoteAsset1 !== 'USDT' || quoteAsset1 !== 'BUSD') && (quoteAsset2 !== 'USDT' || quoteAsset2 !== 'BUSD')) {
        var symbol1 = quoteAsset1 + 'USDT';

        var conversionPrice1 = await getData.getPrice(symbol1);

        quoteAsset1Spent = quoteAsset1Spent * conversionPrice1;

        var symbol2 = quoteAsset2 + 'USDT';

        var conversionPrice2 = await getData.getPrice(symbol2);

        quoteAsset2Rec = quoteAsset2Rec * conversionPrice2;
    }


    if (quoteAsset1Spent < quoteAsset2Rec) {
        profit = quoteAsset2Rec - quoteAsset1Spent;
        profitPerc = (profit / quoteAsset1Spent) * 100;
    } else {
        profit = 0;
        profitPerc = 0;
    }

    console.log('quoteAsset1 : ', quoteAsset1);
    console.log('quoteAsset2 : ', quoteAsset2);
    console.log('quoteAsset1Spent : ', quoteAsset1Spent);
    console.log('quoteAsset2Rec : ', quoteAsset2Rec);
    console.log('profit : ', profit);
    console.log('profitPerc : ', profitPerc);

    return profitPerc;
}








const symbol2Profit = async (symbol1Price, symbol2Price, quoteAsset1, quoteAsset2, qty) => {
    var quoteAsset2Spent, quoteAsset1Rec, conversionPrice, profit, profitPerc;

    quoteAsset2Spent = qty * symbol2Price;

    quoteAsset1Rec = qty * symbol1Price;

    if ((quoteAsset2 !== 'USDT' || quoteAsset2 !== 'BUSD') && (quoteAsset1 == 'USDT' || quoteAsset1 == 'BUSD')) {
        var symbol = quoteAsset2 + quoteAsset1;

        conversionPrice = await getData.getPrice(symbol);

        quoteAsset2Spent = quoteAsset2Spent * conversionPrice;


    } else if ((quoteAsset2 !== 'USDT' || quoteAsset2 !== 'BUSD') && (quoteAsset1 !== 'USDT' || quoteAsset1 !== 'BUSD')) {

        var symbol2 = quoteAsset2 + 'USDT';

        var conversionPrice2 = await getData.getPrice(symbol2);

        quoteAsset2Spent = quoteAsset2Spent * conversionPrice2;

        var symbol1 = quoteAsset1 + 'USDT';

        var conversionPrice1 = await getData.getPrice(symbol1);

        quoteAsset1Rec = quoteAsset1Rec * conversionPrice1;
    }

    if (quoteAsset2Spent < quoteAsset1Rec) {
        profit = quoteAsset1Rec - quoteAsset2Spent;
        profitPerc = (profit / quoteAsset2Spent) * 100;
    } else {
        profit = 0;
        profitPerc = 0;
    }

    console.log('quoteAsset1 : ', quoteAsset1);
    console.log('quoteAsset2 : ', quoteAsset2);
    console.log('quoteAsset1Spent : ', quoteAsset2Spent);
    console.log('quoteAsset2Rec : ', quoteAsset1Rec);
    console.log('profit : ', profit);
    console.log('profitPerc : ', profitPerc);

    return profitPerc;
}