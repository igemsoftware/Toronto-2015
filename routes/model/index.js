var router = require('express').Router();

var MetabolicModel = App.Model('metabolicmodel');

// turn all {}'s into emptry strings
function stringify(object) {
	Object.keys(object).forEach(function(key) {
		if ( typeof(object[key]) === 'object' && Object.keys(object[key]).length > 0 ) {
			stringify(object[key]);
		} else if ( typeof(object[key]) === 'object' ) {
			object[key] = new String();
		}
	});
}

var saveModel = function(req, res, next) {

	stringify(req.body);

	req.body.reactions.forEach(function(reaction) {
		var tempMetabs = new Array()

		Object.keys(reaction.metabolites).forEach(function(key) {
			tempMetabs.push({
				id: key,
				stoichiometric_coefficient: reaction.metabolites[key]
			});
		});

		reaction.metabolites = tempMetabs;
	});

	var model = new MetabolicModel(req.body);

	model.save(function(err, savedModel) {
		if (err) {
			console.log(err)
			res.status(500).send('500 Internal Server Error');
		}

		console.log(savedModel);
		res.send('Saved a Model\n');
	});
}

router.post('/create', saveModel);

module.exports = router;
