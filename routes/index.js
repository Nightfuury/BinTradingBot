const express = require("express");
const router = express.Router();

const trxnController = require('../controllers/transaction');
const userAssetController = require('../controllers/userAsset');

// Get all transactions



router.get("/getAllTransactions", trxnController.getAllTransactions);

// Get all transactions
router.get("/getUserAssets", userAssetController.getUserAssets);


router.get("/", (req, res) => {
    res.send('Hello World');
})

module.exports = router