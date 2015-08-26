var router = require('express').Router();

var MetabolicModel = App.Model('metabolicmodel');

var saveModel = function(req, res, next) {

	req.body.reactions.forEach(function(reaction) {
		if (reaction.notes === {}) {
			reaction.notes = new String();
		}

		var tempMetabs = new Array()

		Object.keys(reaction.metabolites).forEach(function(key) {
			tempMetabs.push({
				id: key,
				stoichiometric_coefficient: reaction.metabolites[key]
			})
		});

		reaction.metabolites = tempMetabs;

		console.log('this:', reaction);
	});

	var model = new MetabolicModel(req.body);

	model.save(function(err, savedModel) {
		if (err) {
			// console.log(err)
			res.status(500).send('500 Internal Server Error');
		}

		console.log(savedModel);
		res.send('Saved a Model\n');
	});
}

router.post('/create', saveModel);

module.exports = router;
