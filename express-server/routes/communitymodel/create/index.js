var router = require('express').Router();
var fs = require('fs');

var MetabolicModel = App.Model('metabolicmodel');

function appendModelToReq(req, res, next) {
    if (req.body.ConsortiaFlux) {
        req.ConsortiaFlux.model = req.body;
        next();
    } else {
        req.ConsortiaFlux = {
            model: req.body
        };
        next();
    }
}

function saveCommunityModel(req, res, next) {
    model = new MetabolicModel(req.ConsortiaFlux.model);

    model.save(function(err, model) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (model) {
            fs.writeFile('savedCommunity.json', JSON.stringify(model));
            res.send('Wrote model');
        }
    });
}

router.post('/', [
    appendModelToReq,
    App.MW('prepareModel'),
    saveCommunityModel
]);

module.exports = router;
