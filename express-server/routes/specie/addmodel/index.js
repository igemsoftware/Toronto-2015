var router = require('express').Router();
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var Species  = App.Model('species');
var Model = App.Model('model');

function dashify(str) {
    dashedStr = str;
    while (dashedStr.indexOf(' ') !== -1) {
        dashedStr = dashedStr.replace(' ', '-');
    }
    return dashedStr;
}

// next() if req.body.id isnt ''
function checkIfModelHasId(req, res, next) {
    if (req.body.id === '') {
        res.status(403).send("Won't add model with empty id\n");
    } else {
        next();
    }
}

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
            req.ConsortiaFlux = {
                metabolicModel: req.body
            };
            next();
        }
    });
}

// App.MW('injectModel')

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

            // Write metabolicModel to disk
            var metabolicModel = req.ConsortiaFlux.metabolicModel;
            // var fileName = path.resolve(__dirname, '../../../', folder + '/' + specie.id + '.json');
            var fileName = folder + '/' + specie.id + '.json';
            fs.writeFile(fileName, JSON.stringify(metabolicModel), function(err) {
                if (err) {
                    console.log(err);
                    res.status(500).send('500 Internal Server Error');
                    return;
                }

                var model = new Model({
                    id: dashify(metabolicModel.id),
                    file: fileName,
                    type: 'specie',
                    specie: specie._id
                });

                model.save(function(err, model) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('500 Internal Server Error');
                        return;
                    }

                    specie.models.push(model._id);

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
    });
}


router.post('/:id', [
    checkIfModelHasId,
    checkIfSpecieExists,
    checkIfModelExists,
    App.MW('injectModel'),
    addModel
]);

module.exports = router;
