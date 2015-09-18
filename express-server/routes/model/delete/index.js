var router = require('express').Router();
var fs = require('fs')

MetabolicModel = App.Model('metabolicmodel');
var addreaction = function(req, res, next) {
    var model = MetabolicModel.findOne({
        id: req.body.id
    })

    if (!model) {
        res.status(204).send('204 no content. That model does not exist.\n');
    } else {
        //model = model.reactions.concat(req.body.reactions)
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
	        });

	        model.reactions.concat(req.body.reactions);
	        model.id = req.body.newid
	        var newModel = new MetabolicModel(model);


	        newModel.save(function(err, savedModel) {
	            if (err) {
	                console.error(err)
	                res.status(500).end('500 Internal Server Error\n');
	                return;
	            }
	            res.send('Saved a MetabolicModel with id ' + savedModel.id + '\n');
	        })
        })


    }

}

router.post('/', addreaction);

module.exports = router;
