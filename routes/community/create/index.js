var router = require('express').Router();

var MetabolicModel = App.Model('metabolicmodel');

function compareMetabolites(specieId, masterMetabolites) {
	MetabolicModel.findOne({id: specieId}, function(err, model) {
		model.metabolites.forEach(function(metabolite) {

			if (metabolite.id in masterMetabolites) {
				console.log(specieId, metabolite.id);
			}
		})
	});
}

function createCommunity(req, res, next) {
	MetabolicModel.findOne({id: req.body.master}, function(err, model) {
		if (err) {
			res.status(500).send('500 Internal Server Error');
			return;
		}

		var masterMetabolites = new Object();

		model.metabolites.forEach(function(metabolite) {
			masterMetabolites[metabolite.id] = metabolite;
		});

		req.body.species.forEach(function(specie) {
			if (specie !== req.body.master) {
				console.log(specie);
				compareMetabolites(specie, masterMetabolites);
			}
		})

		res.send(masterMetabolites);
	});
}

router.post('/', createCommunity);

module.exports = router;
