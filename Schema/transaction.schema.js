const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    buyAsset: String,
    sellAsset: String,
    buyPrice: Number,
    sellPrice: Number,
    quantity: Number,
    buyOrderId: Number,
    sellOrderId: Number,
    buyTradeId: Number,
    sellTradeId: Number,
    transactionTime: Number,
    profitPercentage : Number,
    status: String
});

module.exports.Transaction = mongoose.model('Transaction', transactionSchema);

