const mongoose = require('mongoose');

const symbolSchema = new mongoose.Schema({
    symbol: String,
    baseAsset: String,
    quoteAsset: String,
    stepSize: Number,
    minNotional: Number,
    minQty: Number,
    maxQty: Number
});

module.exports.Symbol = mongoose.model('Symbol', symbolSchema);

