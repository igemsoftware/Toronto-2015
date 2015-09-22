var router = require('express').Router();
var fs = require('fs');
var cp = require('child_process');
var sets = require('simplesets');

var MetabolicModel = App.Model('metabolicmodel');
var Community = App.Model('community');


function checkIfCommunityExists(req, res, next) {
    var requestSet = new sets.Set(req.body.models);

    Community.find('members', function(err, communities) {
        if (err) {
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
                    res.send('Cannot create community ' + req.body.name + ' , a community with the same models already exists\n');
                } else {
                    next();
                }
            });
        }
    });
}

function writeModel(id, cb) {
    MetabolicModel.findOne({
        id: id
    }, 'id file', function(err, model) {
        if (err) {
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

function createCommunity(req, res, next) {
    // Given an array of <valid?> model ids
    var community = {};
    community.name = req.body.name;
    community.members = [];

    var checkProgress = function(modelId, file) {
        community.members.push({
            model: modelId,
            file: file
        });

        if (community.members.length === req.body.models.length) {
            req.ConsortiaFlux = {
                community: community
            };
            next();
            // community = new Community(community);
            //
            // community.save(function(err, community) {
            //     req.ConsortiaFlux = {
            //         community: community
            //     };
            //
            //     next();
            // });
        }
    };

    req.body.models.forEach(function(model) {
        writeModel(model, checkProgress);
    });
}

function optimizeCommunity(req, res, next) {
    var files = [];
    req.ConsortiaFlux.community.members.forEach(function(member) {
        files.push(member.file);
    });

    console.log(files);

    params = {
        input: files,
        output: req.ConsortiaFlux.community.name
    };

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
        res.send(results);
    });
}

router.post('/', [
    checkIfCommunityExists,
    createCommunity,
    optimizeCommunity
]);

module.exports = router;
