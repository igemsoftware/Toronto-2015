var router = require('express').Router();
var Model = App.Model('model');
var Species = App.Model('species');
var fs = require('fs');



router.post('/:id', function(req,res, next) {
	Species.findOne({id: req.params.id}, function(err, specie) {

		if (err) {
			res.status(500).send('500 Internal Server Error\n');
			return;
		}
		if (!specie) {
			res.status(204).send('204 no content. That model does not exist.\n');
		} else {
			Model.findOne({_id: specie.models[0]}, function(err, model){
				//console.log(req.body)
				fs.readFile(model.file, function(err, data){
					data = JSON.parse(data)
					if(err)
						return res.send(err)
					data.metabolites = data.metabolites.concat(req.body.addedMetabolites);
					data.reactions = data.reactions.concat(req.body.addedReactions);
					for(var i = 0; i < data.reactions.length; i++){
						if(req.body.deletedReactions.indexOf(data.reactions[i].id) >= 0){
							data.reactions.splice(i, 1);
						}
					}
					file = model.file.split(".json")
					fs.writeFile(file + "-" + specie.models.length + ".json", JSON.stringify(data), function(err, data){
						if(err)
							return res.send(err)
						res.send("Saved file!")
					})
				});
				// var modelSchema = {
	            //     id: req.params.id + "-" + model.models.length
	            // }
				//console.log(modelSchema)
				// res.send(model);
			})



		}
	});
});




module.exports = router;
