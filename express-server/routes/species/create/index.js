var router = require('express').Router();

var Species = App.Model('species');

function checkIfSpecieExists(req, res, next) {
    id = req.body.SPECIES + '_' + req.body.STRAIN;

    Species.findOne({id: id}).lean().exec(function(err, specie) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (specie) {
            res.status(403).send('Cannot create specie, existing specie with id ' + id + ' exists\n');
        } else {
            next();
        }
    });
}

function createSpecieMeta(req, res, next) {
    specie = new Species(req.body);
    specie.id = specie.SPECIES + '_' + specie.STRAIN;

    specie.save(function(err, savedSpecie) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        res.send('Created specie with id ' + savedSpecie.id + '\n');
    });
}

router.post('/', [
    checkIfSpecieExists,
    createSpecieMeta
]);

module.exports = router;
