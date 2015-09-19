var router = require('express').Router();

var MetabolicModel = App.Model('metabolicmodel');

function compareMetabolites(specieId, masterMetabolites) {

	// Build dict with id:metabolite
	var masterMetabolitesIds = new Object();
	masterMetabolites.forEach(function(metabolite) {
		masterMetabolitesIds[metabolite.id] = metabolite;
	});

	// Build dict with name:metabolite
	var masterMetabolitesNames = new Object();
	masterMetabolites.forEach(function(metabolite) {
		masterMetabolitesNames[metabolite.name] = metabolite;
	});

	MetabolicModel.findOne({id: specieId}, function(err, model) {
		model.metabolites.forEach(function(metabolite) {

			if (metabolite.id in masterMetabolitesIds) {
				console.log('same id: ', specieId, metabolite.id);

				if (metabolite.compartment === 'e') {
					console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
				}
			}

			if (metabolite.name in masterMetabolitesNames) {
				console.log('same name: ', specieId, metabolite.name, metabolite.id)

				if (metabolite.compartment === 'e') {
					console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
				}
			}
		})
	});
}

function createCommunity(req, res, next) {
	// Retrieve Master model for Master Metabolites
	MetabolicModel.findOne({id: req.body.master}, function(err, masterModel) {
		if (err) {
			res.status(500).send('500 Internal Server Error');
			return;
		}

		req.body.species.forEach(function(specie) {
			// Compare everything but master with master
			if (specie !== req.body.master) {
				console.log(specie);
				compareMetabolites(specie, masterModel.metabolites);
			}
		})

		res.send('Creating community');
	});
}

router.post('/', createCommunity);

module.exports = router;
