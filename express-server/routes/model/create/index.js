var router = require('express').Router();
var fs = require('fs');

var MetabolicModel = App.Model('metabolicmodel');

// Recursively turn all {}'s into empty strings
function stringify(object) {
	Object.keys(object).forEach(function(key) {
		if ( typeof(object[key]) === 'object' && Object.keys(object[key]).length > 0 ) {
			stringify(object[key]);
		} else if ( typeof(object[key]) === 'object' ) {
			object[key] = '';
		}
	});
}

function saveModel(req, res, next) {
    var model = req.body;

	stringify(model);

    // Metabolites Dictionary
    var metabolitesDict = {};
    model.metabolites.forEach(function(metabolite) {
        metabolitesDict[metabolite.id] = metabolite;
        metabolite.subsystems = [];
    });

    // TODO fix same subsystem pushed twice
    model.reactions.forEach(function(reaction) {
        Object.keys(reaction.metabolites).forEach(function(metabolite) {
            if (metabolitesDict[metabolite].subsystems.indexOf(reaction.subsystem) === -1) {
                metabolitesDict[metabolite].subsystems.push({
                    name:reaction.subsystem
                });
            }
        });
    });

	model.reactions.forEach(function(reaction) {
        // Metabolite conversion
		var tempMetabs = [];
		Object.keys(reaction.metabolites).forEach(function(key) {
			tempMetabs.push({
				id: key,
				stoichiometric_coefficient: reaction.metabolites[key]
			});
		});
		reaction.metabolites = tempMetabs;

        // Species Insertion
        reaction.species = [{
            name: model.id
        }];
	});

    model.metabolites.forEach(function(metabolite) {
        metabolite.species = [{
            name: model.id
        }];
    });

    model = new MetabolicModel(model);

    // Write 'transformed' model to disk
    model.transform(function(transformedModel) {
        // TODO Species folder
        var filePath = App.config().staticStore + '/models/' + model.id + '.json';

        fs.writeFile(filePath, JSON.stringify(transformedModel), function(err) {
            if (err) {
                res.status(500).send('500 Internal Server Error');
                return;
            }

            model.file = filePath;

            model.save(function(err, model){
                if (err) {
                    res.status(500).send('500 Internal Server Error');
                    return;
                }

                res.send('Created model with id ' + model.id + ', stored at: ' + model.file + '\n');
            });
        });
    });
}

router.post('/', [
	App.MW('verifyModelNonExistence'),
	saveModel
]);

module.exports = router;
