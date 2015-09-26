var router = require('express').Router();
var Model = App.Model('model');
var Species = App.Model('species');
var cp = require('child_process');
var fs = require('fs');


function updateModel(req, res, next) {
    Model.findOne({
        id: req.params.id
    }, function(err, model) {

        if (err) {
            res.status(500).send('500 Internal Server Error\n');
            return;
        }
        if (!model) {
            res.status(204).send('204 no content. That model does not exist.\n');
        } else {
            Species.findOne({
                _id: model.specie
            }, function(err, specie) {

                fs.readFile(model.file, function(err, data) {
                    data = JSON.parse(data);
                        //console.log(data.metabolites)
                    if (err)
                        return res.send(err);
                    data.metabolites = data.metabolites.concat(req.body.addedMetabolites);
                    data.reactions = data.reactions.concat(req.body.addedReactions);
                    for (var i = 0; i < data.reactions.length; i++) {
                        if (req.body.deletedReactions.indexOf(data.reactions[i].id) >= 0) {
                            data.reactions.splice(i, 1);
                        }
                    }
                    file = model.file.split(".json");
                        //add subsytem to metabolites

                    req.ConsortiaFlux = {
                        metabolicModel: data,
                        specie: specie,
                        file: file
                    };
                    next();
                });
                // var modelSchema = {
                //     id: req.params.id + "-" + model.models.length
                // }
                //console.log(modelSchema)
                // res.send(model);
            });
        }
    });
}

function writeFile(req, res, next) {
    // console.log(file)
    // console.log(file[0] + "-" + model.models.length + ".json")
    var specie = req.ConsortiaFlux.specie;
    var file = req.ConsortiaFlux.file;
    var fileName = file[0] + "-" + specie.models.length + ".json";
    var model = req.ConsortiaFlux.metabolicModel;
    fs.writeFile(fileName, JSON.stringify(model), function(err, data) {
        if (err)
            return res.send(err);
                //TODO save new model and push _id to specie
        m = new Model({
            file: file[0] + "-" + specie.models.length + ".json",
            id: req.body.id + "-" + specie.models.length,
            type: 'specie',
            addedMetabolites: req.body.addedMetabolites,
            addedReactions: req.body.addedReactions
        });
            //sketchy as hell

        for (var i = 0; i < req.body.addedReactions.length; i++) {
            for (var element in req.body.addedReactions[i].metabolites) {
                var temp = {};
                temp.stoichiometric_coefficient = req.body.addedReactions[i].metabolites[element];
                temp.id = element;
                m.addedReactions[i].metabolites.push(temp);
            }
        }

        req.ConsortiaFlux.metabolicModel = m;
        next();
    });
}

function modifyDictionary(req, res, next) {
    args = ['cFBA-Pipeline/load-to-dictionaries.py', req.ConsortiaFlux.metabolicModel.file];

    var results = {
        output: '',
        errorlog: '',
        exitcode: null
    };

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

        console.log(results);

        next();
    });
}

function saveModel(req, res, next) {
    req.ConsortiaFlux.metabolicModel.save(function(err, model) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }


        req.ConsortiaFlux.specie.models.push(model._id);

        console.log(req.ConsortiaFlux);

        req.ConsortiaFlux.specie.save(function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('500 Internal Server Error');
                return;
            }

            console.log('saving specie');
            if (err) {
                res.status(500).send('500 Internal Server Error');
                return;
            }
            // console.log(data)
            // console.log(model.addedReactions);
            // console.log(req.ConsortiaFlux.specie);
            res.send('sent');
        });
    });
}

router.post('/:id', [
    updateModel,
    App.MW('injectmodel'),
    writeFile,
    modifyDictionary,
    saveModel
]);






module.exports = router;
