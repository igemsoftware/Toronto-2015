var router   = require('express').Router();

var Species  = App.Model('species');

function checkIfSpecieExists(req, res, next) {
    id = req.params.id;

    Species.findOne({id: id}).lean().exec(function(err, specie) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (specie) {
            next();
        } else {
            res.status(403).send('Cannot create model for a specie that does not exist\n');
        }
    });
}

function checkIfModelExists(req, res, next) {
    Species.findOne({id: req.params.id}).select('id models').lean().exec(function(err, specie) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }


        var okay = true;

        specie.models.forEach(function(model) {
            if (model.id === req.body.id) {
                okay = false;
                res.status(403).send('Cannot add existing model ' + req.body.id + ' to specie ' + specie.id + '\n');
                return;
            }
        });

        if (okay) {
            next();
        }
    });
}

function addModel(req, res, next){
    Species.findOne({id: req.params.id}, 'id models', function(err, specie) {
        if (err) {
            console.log(err);
            res.status(500).send('500 Internal Server Error');
            return;
        }

        specie.models.push({
            id: req.body.id
        });

        specie.save(function(err, specie) {
            if (err) {
                res.status(500).send('500 Internal Server Error');
                return;
            }

            res.send('Updated specie ' + specie.id + ' with model ' + req.body.id + '\n');
        });
    });
}


router.post('/:id', [
    checkIfSpecieExists,
    checkIfModelExists,
    addModel
]);

module.exports = router;
