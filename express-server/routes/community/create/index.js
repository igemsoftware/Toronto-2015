var router = require('express').Router();
var fs = require('fs');

var MetabolicModel = App.Model('metabolicmodel');

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
                fileName = 'temp/' + id + '_' + (new Date()).getTime() + '.json';

                fs.writeFile(fileName, function(err) {
                    if (err) {
                        res.status(500).send('500 Internal Server Error');
                        return;
                    }

                    cb(fileName);
                });
            });
        }
    });
}

function createCommunity(req, res, next) {
    // Given an array of model ids
    // res.send(req.body.models);

    var files = [];

    var checkProgress = function(file) {
        files.push(file);

        if (files.length === req.body.models.length) {
            res.send(files);
        }
    };

    req.body.models.forEach(function(model) {
        writeModel(model, checkProgress);
    });

}

router.post('/', createCommunity);

module.exports = router;
