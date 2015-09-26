var router = require('express').Router();
var fs = require('fs');
var cp = require('child_process');
var mkdirp = require('mkdirp');

var sets = require('simplesets');

var Model = App.Model('model');
var Community = App.Model('community');

function dashify(str) {
    dashedStr = str;
    while (dashedStr.indexOf(' ') !== -1) {
        dashedStr = dashedStr.replace(' ', '-');
    }
    return dashedStr;
}

function checkIfCommunityExists(req, res, next) {
    var requestSet = new sets.Set(req.body.models);

    Community.find('members', function(err, communities) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (communities.length === 0) {
            next();
        } else {
            communities.forEach(function(community) {
                var currentSet = new sets.Set([]);

                community.members.forEach(function(member) {
                    currentSet.add(member.model);
                });

                if (requestSet.equals(currentSet)) {
                    res.send(community);
                    // res.send('Cannot create community ' + req.body.name + ' , a community with the same models already exists\n');
                } else {
                    next();
                }
            });
        }
    });
}

function getModelIdAndFile(id, cb, res) {
    Model.findOne({
        id: id
    }, 'id file', function(err, model) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (!model) {
            res.status(204).send('204 no content. The model ' + id + ' does not exist.');
            return;
        } else {
            cb(id, model.file);
        }
    });
}

// TODO validate array of modelIds


function createCommunity(req, res, next) {
    console.log(req.body);
    // Given an array of valid model ids
    var community = {};
    community.name = req.body.name;
    community.id = dashify(community.name);
    community.members = [];

    var checkProgress = function(modelId, file) {
        console.log(modelId);
        community.members.push({
            model: modelId,
            file: file
        });

        if (community.members.length === req.body.models.length) {
            req.ConsortiaFlux = {
                community: community
            };
            next();
        }
    };

    req.body.models.forEach(function(model) {
        getModelIdAndFile(model, checkProgress, res);
    });
}

function optimizeCommunity(req, res, next) {
    var files = [];
    req.ConsortiaFlux.community.members.forEach(function(member) {
        files.push(member.file);
    });


    console.log(files);

    var outputFile = dashify(req.ConsortiaFlux.community.name);
    var outputFolder = App.config().staticStore + '/communities/' + outputFile;
    var output = outputFolder + '/' + outputFile;

    mkdirp(outputFolder, function(err, made) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        params = {
            input: files,
            output: output
        };
        // console.log(params.input[0])
        // fs.readFile(params.input[0], function(err, data){
        //     console.log(data)
        // })
        args = ['cFBA-Pipeline/run.py', JSON.stringify(params)];

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

            req.ConsortiaFlux.community.file = outputFolder + '/' + outputFile + '.json';
            req.ConsortiaFlux.community.solution = outputFolder + '/' + outputFile + '_solution.json';

            fs.readFile(output + '.json', function(err, model) {
                if (err) {
                    console.log(err);
                    res.status(500).send('500 Internal Server Error');
                    return;
                }

                model = JSON.parse(model);
                model.id = req.ConsortiaFlux.community.id;
                model.type = 'community';
                next();
            });
        });
    });
}

function saveCommunity(req, res, next) {
    community = new Community(req.ConsortiaFlux.community);

    community.save(function(err, community) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        res.send(community);
    });
}

router.post('/', [
    checkIfCommunityExists,
    createCommunity,
    optimizeCommunity,
    saveCommunity
]);

module.exports = router;
