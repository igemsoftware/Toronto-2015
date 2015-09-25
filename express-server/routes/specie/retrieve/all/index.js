var router = require('express').Router();

var Species = App.Model('species');

function findAllSpecies(req, res, next) {
    Species.find().populate('models').exec(function(err, species) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (species.length === 0) {
            res.status(403).send('No species\n');
            return;
        } else {
            res.send(species);
        }
    });
}

router.get('/', findAllSpecies);

module.exports = router;
