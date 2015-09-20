var router = require('express').Router();

var MetabolicModel = App.Model('metabolicmodel');

// turn all {}'s into empty strings
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

	stringify(req.body);

    // Metabolites Dictionary
    var metabolitesDict = {};
    req.body.metabolites.forEach(function(metabolite) {
        metabolitesDict[metabolite.id] = metabolite;
        // metabolite.subsystems = [{
        //     name: reaction.subsystem
        // }];
        metabolite.subsystems = [];
    });

    req.body.reactions.forEach(function(reaction) {
        Object.keys(reaction.metabolites).forEach(function(metabolite) {
            if (metabolitesDict[metabolite].subsystems.indexOf(reaction.subsystem) === -1) {
                metabolitesDict[metabolite].subsystems.push({
                    name:reaction.subsystem
                });
            }
        });
    });

    // Insert subsystems into metabolites
    // req.body.reactions.forEach(function(reaction) {
    //     console.log(reaction.id);
    //     if (reaction.subsystem === '')
    //         reaction.subsystem = 'Unassigned';
    //
    //     Object.keys(reaction.metabolites).forEach(function(metabolite) {
    //         if (!metabolitesDict[metabolite].subsystems) {
    //             metabolitesDict[metabolite].subsystems =[{
    //                 name: reaction.subsystem
    //             }];
    //         } else {
    //             metabolitesDict[metabolite].subsystems.forEach(function(subsystem) {
    //                 if (subsystem.name !== reaction.subsystem)
    //                     if (metabolitesDict[metabolite].subsystems) {
    //                         metabolitesDict[metabolite].subsystems.push({
    //                             name: reaction.subsystem
    //                         });
    //                     } else {
    //                         metabolitesDict[metabolite].subsystems = [{
    //                             name: reaction.subsystem
    //                         }];
    //                     }
    //             });
    //         }
    //     });
    // });

	req.body.reactions.forEach(function(reaction) {
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
            name: req.body.id
        }];
	});

    // var metabsArray = [];
    // Object.keys(metabolitesDict).forEach(function(metabolite) {
    //     metabsArray.push(metabolitesDict[metabolite]);
    // });
    // req.body.metabolites = metabsArray;


    // req.body.metabolites.forEach(function(metabolite) {
    //     console.log(metabolite.subsystems);
    // });

    req.body.metabolites.forEach(function(metabolite) {
        metabolite.species = [{
            name: req.body.id
        }];
    });

	var model = new MetabolicModel(req.body);

	model.save(function(err, savedModel) {
		if (err) {
			console.log(err);
			res.status(500).send('500 Internal Server Error\n');
		}

		res.send('Saved a MetabolicModel with id ' + savedModel.id + '\n');
	});
}

router.post('/', [
	App.MW('verifyModelNonExistence'),
	saveModel
]);

module.exports = router;
