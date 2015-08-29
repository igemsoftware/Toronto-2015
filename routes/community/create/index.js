var router = require('express').Router();

var MetabolicModel = App.Model('metabolicmodel');

function createCommunity(req, res, next) {
	res.send('Creating a community\n');
}

router.post('/', createCommunity)

module.exports = router;
