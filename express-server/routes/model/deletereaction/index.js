var router = require('express').Router();
var mongoose = require('mongoose');
var fs = require('fs');

MetabolicModel = App.Model('metabolicmodel');
var deleteReaction = function(req, res, next) {
    var model = MetabolicModel.findOne({
        id: req.body.id
    })
    model.select("-_id -reactions._id -metabolites._id -reaction.metabolites._id").exec(function(err, model) {
        for(var i = 0; i < model.reactions.length; i++)
        {
            if(model.reactions[i].req === req.body.reactionID)
                model.reactions.splice(i, 1)
        }
        model.id = req.body.newid
        newModel = new MetabolicModel(model)
        newModel._id = mongoose.Types.ObjectId();
        newModel.save(function(err, model) {
            if (err) {
                console.log(err)
                return res.send(err)
            }
            res.send("You successfully changed and added model " + model.id)
        })
    })

}


router.post('/', deleteReaction);

module.exports = router;
