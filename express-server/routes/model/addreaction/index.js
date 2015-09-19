var router = require('express').Router();
var mongoose = require('mongoose')
var request = require('request');
var fs = require('fs')

MetabolicModel = App.Model('metabolicmodel');
var addreaction = function(req, res, next) {
    var model = MetabolicModel.findOne({
        id: req.body.id
    })
    model.select("-_id -reactions._id -metabolites._id -reaction.metabolites._id").exec(function(err, model) {
            req.body.reactions.forEach(function(reaction) {
                var tempMetabs = new Array()
                Object.keys(reaction.metabolites).forEach(function(key) {
                    tempMetabs.push({
                        id: key,
                        stoichiometric_coefficient: reaction.metabolites[key]
                    });
                });

                reaction.metabolites = tempMetabs;

                model.reactions.concat(req.body.reactions);
                model.id = req.body.newid
                newModel = new MetabolicModel(model)
                newModel._id = mongoose.Types.ObjectId();
                newModel.save(function(err, model) {
                    if (err){
                        console.log(err)
                        return res.send(err)
                    }
                    res.send("You successfully added model " + model.id)
                })
            })
        })
    }




router.post('/', addreaction);

module.exports = router;
