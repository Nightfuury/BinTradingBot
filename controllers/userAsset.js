var getData = require('../UtilFunctions/getData');

const getUserAssets = async (req, res) => {
    let userAssets = await getData.getAssets();
	res.send(userAssets);
}

module.exports = {
    getUserAssets,
}