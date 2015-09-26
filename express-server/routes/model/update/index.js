var router = require('express').Router();
var Model = App.Model('model');
var Species = App.Model('species');
var fs = require('fs');



router.post('/:id', function(req, res, next) {

    Model.findOne({
        id: req.params.id
    }, function(err, model) {

        if (err) {
            res.status(500).send('500 Internal Server Error\n');
            return;
        }
        if (!model) {
            res.status(204).send('204 no content. That model does not exist.\n');
        } else {
            Species.findOne({
                _id: model.specie
            }, function(err, specie) {

                fs.readFile(model.file, function(err, data) {
                    data = JSON.parse(data)
                    //console.log(data.metabolites)
                    if (err)
                        return res.send(err)
                    data.metabolites = data.metabolites.concat(req.body.addedMetabolites);
                    data.reactions = data.reactions.concat(req.body.addedReactions);
                    for (var i = 0; i < data.reactions.length; i++) {
                        if (req.body.deletedReactions.indexOf(data.reactions[i].id) >= 0) {
                            data.reactions.splice(i, 1);
                        }
                    }
                    file = model.file.split(".json")
                        // console.log(file)
                        // console.log(file[0] + "-" + model.models.length + ".json")
                    fs.writeFile(file[0] + "-" + specie.models.length + ".json", JSON.stringify(data), function(err, data) {
                        if (err)
                            return res.send(err)
                                //TODO save new model and push _id to specie
						m = new Model({
							file: file[0] + "-" + specie.models.length + ".json",
							id: req.body.id + "-" + specie.models.length,
							type: model.type,
							addedMetabolites: req.body.addedMetabolites,
							addedReactions: req.body.addedReactions
						})
						//sketchy as hell

						for(var i = 0; i < req.body.addedReactions.length; i++){
							for(var element in req.body.addedReactions[i].metabolites){
								var temp = {}
								temp.stoichiometric_coefficient = req.body.addedReactions[i].metabolites[element]
								temp.id = element
								m.addedReactions[i].metabolites.push(temp)
							}
						}


						m.save(function(err, modelSchema){
							specie.models.push(modelSchema._id);
	                        specie.save(function(err, data) {
	                            if (err)
	                                return res.send(err)
								// console.log(data)
								console.log(modelSchema.addedReactions)
								res.send("Sent")
	                        });
						})


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
