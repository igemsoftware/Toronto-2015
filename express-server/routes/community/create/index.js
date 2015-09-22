var router = require('express').Router();
var fs = require('fs');

var MetabolicModel = App.Model('metabolicmodel');
var Community = App.Model('community');

function writeModel(id, cb) {
    MetabolicModel.findOne({id: id}, function(err, model) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (!model) {
            res.status(204).send('204 no content. The model ' + id + ' does not exist.');
            return;
        } else {
            model.transform(function(model) {
                fileName = App.config().static + '/' + id + '_' + (new Date()).getTime() + '.json';

                fs.writeFile(fileName, function(err) {
                    if (err) {
                        res.status(500).send('500 Internal Server Error');
                        return;
                    }

                    cb(id, fileName);
                });
            });
        }
    });
}

function createCommunity(req, res, next) {
    // Given an array of <valid?> model ids
    var community = {};
    console.log(req.body);
    community.name = req.body.name;
    community.members = [];

    var checkProgress = function(model, file) {
        community.members.push({
            model: model,
            file: file
        });

        if (community.members.length === req.body.models.length) {
            // res.send(files);

            console.log(community);
            community = new Community(community);
            console.log(community);

            community.save(function(err, community) {
                res.send(community);
            });
        }
    };

    req.body.models.forEach(function(model) {
        writeModel(model, checkProgress);
    });

}


function checkIfCommunityExists(req, res, next) {
    Community.findOne({name: req.body.name}, function(err, community) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (!community) {
            next();
        } else {
            res.send('Cannot create community "' + req.body.name + '"\n');
        }
    });
}

router.post('/', [
    checkIfCommunityExists,
    createCommunity
]);

module.exports = router;
