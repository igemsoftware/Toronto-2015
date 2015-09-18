var router = require('express').Router();
var fs = require('fs')

MetabolicModel = App.Model('metabolicmodel');
var deleteReaction = function(req, res, next) {
    var model = MetabolicModel.findOne({
        id: req.body.id
    }, function(err, model) {


    })




}


router.post('/', deleteReaction);

module.exports = router;
