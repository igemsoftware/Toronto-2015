var router = require('express').Router();

var MetabolicModel = App.Model('metabolicmodel');

function findAll(req, res, next) {
	MetabolicModel.find(function(err, models) {
		var ids = [];
		models.forEach(function(model) {
			ids.push(model.id);
		});

		res.send(ids);
	});
}

router.get('/', findAll);

router.get('/:id', function(req,res, next) {
	MetabolicModel.findOne({id: req.params.id}, function(err, model) {
		if (err) {
			res.status(500).send('500 Internal Server Error\n');
			return;
		}

		if (!model) {
			res.status(204).send('204 no content. That model does not exist.\n');
		} else {
			model.dictifyReactionMetabolites(function(model) {
				res.send(model);
			});
		}
	});
});

module.exports = router;
