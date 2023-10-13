var Transaction = require('../Schema/transaction.schema');

const getAllTransactions = async (req, res) => {
    let page = req.query.page;
    let per_page = req.query.limit;

    const trxns = await Transaction.Transaction.find().sort({transactionTime:-1})
        .limit(per_page * 1)
        .skip((page - 1) * per_page)
        .exec();

    res.send(trxns);
}

module.exports = {
    getAllTransactions,
}