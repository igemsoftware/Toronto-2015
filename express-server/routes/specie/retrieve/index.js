var router = require('express').Router();

var Species = App.Model('species');

function retrieveSpecie(req, res, next) {
    Species.findOne({id: req.params.id}).populate('models').select('-_id').exec(function(err, specie) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (specie) {
            res.send(specie);
        } else {
            res.status(403).send('Specie not found\n');
        }
    });
}

router.get('/:id', retrieveSpecie);

module.exports = router;
