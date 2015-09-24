var router = require('express').Router();

var Species = App.Model('species');

function dashify(str) {
    dashedStr = str;
    while (dashedStr.indexOf(' ') !== -1) {
        dashedStr = dashedStr.replace(' ', '-');
    }
    return dashedStr;
}

function checkIfSpecieExists(req, res, next) {
    id = dashify(req.body.SPECIES )+ '_' + dashify(req.body.STRAIN);

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

function saveSpecieMeta(req, res, next) {
    specie = new Species(req.body);
    specie.id = dashify(specie.SPECIES) + '_' + dashify(specie.STRAIN);

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
    saveSpecieMeta
]);

module.exports = router;
