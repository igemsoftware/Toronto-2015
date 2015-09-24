var router   = require('express').Router();
var fs = require('fs');
var mkdirp = require('mkdirp');
var Species  = App.Model('species');

// next() if specie exists
function checkIfSpecieExists(req, res, next) {
    id = req.params.id;

    Species.findOne({id: id}).lean().exec(function(err, specie) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (specie) {
            next();
        } else {
            res.status(403).send('Cannot create model for a specie that does not exist\n');
        }
    });
}


// next() if modelId not found in specie.models
function checkIfModelExists(req, res, next) {
    Species.findOne({id: req.params.id}).select('id models').lean().exec(function(err, specie) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }


        var okay = true;

        specie.models.forEach(function(model) {
            if (model.id === req.body.id) {
                okay = false;
                res.status(403).send('Cannot add existing model ' + req.body.id + ' to specie ' + specie.id + '\n');
                return;
            }
        });

        if (okay) {
            next();
        }
    });
}

function addModel(req, res, next) {
    Species.findOne({id: req.params.id}, function(err, specie) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        var folder = App.config().staticStore + '/species/' + specie.id;

        mkdirp(folder, function(err, made) {
            if (err) {
                console.log(err);
                res.status(500).send('500 Internal Server Error');
                return;
            }

            // the metabolic model
            var model = req.body;

            // metabolite dictionary for ease of access
            var metabolitesDict = {};
            model.metabolites.forEach(function(metabolite) {
                metabolite.subsystems = [];
                metabolitesDict[metabolite.id] = metabolite;
            });

            // Need to append some items into our model first:
            model.reactions.forEach(function(reaction) {
                // species array into reactions
                reaction.species = [model.id];

                // Subsystems array into metabolites
                Object.keys(reaction.metabolites).forEach(function(metabolite) {
                    if (reaction.subsystem === '') {
                        reaction.subsystem = 'Undefined';
                    }
                    if (metabolitesDict[metabolite].subsystems.indexOf(reaction.subsystem) === -1) {
                        metabolitesDict[metabolite].subsystems.push(reaction.subsystem);
                    }
                });
        	});
            // species array into metabolites
            model.metabolites.forEach(function(metabolite) {
                metabolite.species = [model.id];
            });

            // Write metabolic model to disk
            var fileName = folder + '/' + specie.id + '.json';
            fs.writeFile(fileName, JSON.stringify(model), function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).send('500 Internal Server Error');
                    return;
                }

                specie.models.push({
                    id: model.id,
                    file: fileName
                });

                specie.save(function(err, specie) {
                    if (err) {
                        res.status(500).send('500 Internal Server Error');
                        return;
                    }

                    res.send('Updated specie ' + specie.id + ' with model ' + model.id + '\n');
                });
            });
        });
    });
}


router.post('/:id', [
    checkIfSpecieExists,
    checkIfModelExists,
    addModel
]);

module.exports = router;
