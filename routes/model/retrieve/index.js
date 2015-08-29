var router = require('express').Router();

var MetabolicModel = App.Model('metabolicmodel');

function find(req, res, next) {
	MetabolicModel.find(function(err, models) {
		var ids = new Array();
		models.forEach(function(model) {
			ids.push(model.id);
		});

		res.send(ids);
	})
}

router.get('/', find)

module.exports = router;
