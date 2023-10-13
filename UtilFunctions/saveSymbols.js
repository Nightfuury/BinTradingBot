var getDataFunc = require('./getData');
var symbolSchema = require('../Schema/symbols.schema');

module.exports.saveSymbols = async () => {
    let allPairs = await getDataFunc.getAllPairs();

    for (let i = 0; i < allPairs.length; i++) {
        let baseAsset = allPairs[i].baseAsset;

        let quoteAsset = allPairs[i].quoteAsset;

        let filters = allPairs[i].filters;

        let minNotional, minQtyGiven, maxQtyGiven, stepSize;

        await filters.map(filter => {
            if (filter.filterType == 'MIN_NOTIONAL') {
                minNotional = filter.minNotional;
            } else if (filter.filterType == 'LOT_SIZE') {
                minQtyGiven = filter.minQty;
                stepSize = filter.stepSize;
                maxQtyGiven = filter.maxQty;
            }
        })


        let symb = new symbolSchema.Symbol({
            symbol: allPairs[i].symbol,
            baseAsset: baseAsset,
            quoteAsset : quoteAsset,
            stepSize: stepSize,
            minNotional: minNotional,
            minQty: minQtyGiven,
            maxQty: maxQtyGiven
        });

        await symb.save();

    }
}