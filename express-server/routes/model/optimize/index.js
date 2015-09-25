var router = require('express').Router();
var cp = require('child_process');
var path = require('path');
var fs = require('fs');

var Model = App.Model('model');

// This endpoint returns a Model

function checkIfModelExists(req, res, next) {
    Model.findOne({id: req.params.id}, function(err, model) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (model) {
            if (model.solution) {
                res.send(model);
                return;
            }

            req.ConsortiaFlux = {
                metabolicModel: model
            };
            next();
        } else {
            res.status(403).send('Model to be optimized not found\n');
        }
    });
}

function optimizeModel(req, res, next) {
    var inputFile = req.ConsortiaFlux.metabolicModel.file;
    var speciestrain = inputFile.substring(0, inputFile.indexOf('.json'));
    var solutionFile = speciestrain + '_solution.json';

    var results = {
        output: '',
        errorlog: '',
        exitcode: null
    };

    args = [
        'python-scripts/optimize.py',
        path.resolve(__dirname, '../../../', inputFile),
        path.resolve(__dirname, '../../../', speciestrain)
    ];

    var optimizeScript = cp.spawn(App.config().python, args);

    // get stdout
    optimizeScript.stdout.on('data', function(stdout) {
        results.output += stdout.toString();
    });

    // get stderr
    optimizeScript.stderr.on('data', function(stderr) {
        results.errorlog += stderr.toString();
    });

    // script finished
    optimizeScript.on('close', function(code) {
        results.exitcode = code;

        fs.readFile(inputFile, function(err, data) {
            if (err) {
                res.status(500).send('500 Internal Server Errror');
                return;
            }

            model = JSON.parse(data);


            fs.readFile(solutionFile, function(err, data) {
                if (err) {
                    console.log(err);
                    res.status(500).send('500 Internal Server Error');
                    return;
                }

                // Add file path to model
                req.ConsortiaFlux.metabolicModel.solution = solutionFile;

                var x_dict = JSON.parse(data).x_dict;

                // Insert flux values into reactions
                model.reactions.forEach(function(reaction) {
                    // console.log(reaction);
                    if (x_dict[reaction.id] !== undefined && x_dict[reaction.id] !== null) {
                        reaction.flux_value = x_dict[reaction.id];

                    } else {
                        reaction.flux_value = 0;
                    }
                });

                // model.compartments = [{
                //     id: 'c',
                //     name: 'Cytosol'
                // }, {
                //     id: 'e',
                //     name: 'Extracellular'
                // }, {
                //     id: 'p',
                //     name: 'Periplasm'
                // }];

                var optimizedFile = speciestrain + '_optimized.json';
                fs.writeFile(optimizedFile, JSON.stringify(model), function(err) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('500 Internal Server Error');
                        return;
                    }

                    req.ConsortiaFlux.metabolicModel.optimized = optimizedFile;

                    req.ConsortiaFlux.metabolicModel.save(function(err, model) {
                        if (err) {
                            console.log(err);
                            res.status(500).send('500 Internal Server Error');
                            return;
                        }

                        res.send(model.optimized);
                    });
                });
            });
        });
    });
}

router.get('/:id', [
    checkIfModelExists,
    optimizeModel
]);

module.exports = router;
