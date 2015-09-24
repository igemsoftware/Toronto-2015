var router = require('express').Router();

var Model = App.Model('model');

function optimizeModel(req, res, next) {
    Model.findOne({id: req.params.id}).select('file').exec(function(err, model) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        if (model) {
            res.send(model.file);
        } else {
            res.status(403).send('Model to be optimized not found\n');
        }
    });
}

router.get('/:id', optimizeModel);

module.exports = router;
