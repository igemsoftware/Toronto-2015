var router = require('express').Router();

var Species = App.Model('species');

function findAllSpecies(req, res, next) {
    Model.find().exec(function(err, models) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (species.length === 0) {
            res.status(403).send('No models\n');
            return;
        } else {
            res.send(models);
        }
    });
}

router.get('/', findAllSpecies);

module.exports = router;
