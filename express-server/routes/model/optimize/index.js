var router = require('express').Router();
var fs = require('fs');
var cp = require('child_process');

MetabolicModel = App.Model('metabolicmodel');

router.get('/:id', function(req, res, next) {
	MetabolicModel.findOne({id: req.params.id}, function(err, model) {
		if (err) {
			res.status(500).send('500 Internal Server Error');
			return;
		}

		if (!model) {
			res.status(204).send('204 no content. That model does not exist.\n');
		} else {
			model.transform(function(model) {
				//console.log("here")
				//fs.writeFile("asdfasd.json", JSON.stringify(model), function(err){})
				var fileName = 'temp/' + req.params.id + '.json';

				fs.writeFile(fileName, JSON.stringify(model), function(err) {
					if (err) {
						res.status(500).send('500 Internal Server Error');
					} else {
						var results = {
					        output   : '',
					        errorlog : '',
					        exitcode : null
					    };
                        var currentTime = (new Date()).getTime();
                        var solutionFile = 'temp/' + req.params.id + '_' + currentTime;

						args = [
							'python-scripts/optimize.py',
							fileName,
							solutionFile
						];

						var optimizeScript = cp.spawn('python', args);

						// get stdout
						optimizeScript.stdout.on('data', function(stdout) {
					        results.output += stdout.toString();
					    });

					    // get stderr
					    optimizeScript.stderr.on('data', function(stderr) {
					        results.errorlog += stderr.toString();
					    });

					    // script finished
					    optimizeScript.on('close', function(code) {
					        results.exitcode = code;

                            // TODO store solutions in DB.
                            solutionFile = solutionFile + '_solution.json';

                            fs.readFile(solutionFile, function(err, data) {
                                if (err) {
                                    res.status(500).send('500 Internal Server Error');
                                    return;
                                }

                                var x_dict = JSON.parse(data).x_dict;


                                // =============================================
                                model.reactions.forEach(function(reaction) {
                                    // console.log(reaction);
                                    if (x_dict[reaction.id] !== undefined && x_dict[reaction.id] !== null) {
                                        reaction.flux_value = x_dict[reaction.id];

                                    } else {
                                        reaction.flux_value = 0;
                                    }
                                });
                                // =============================================

                                model.compartments = [{
                                    id: 'c',
                                    name: 'Cytosol'
                                }, {
                                    id: 'e',
                                    name: 'Extracellular'
                                }, {
                                    id: 'p',
                                    name: 'Periplasm'
                                }];

                                // fs.writeFile('optimized.json', JSON.stringify(model));
                                res.send(model);

                                // var stream = fs.createReadStream(solutionFile + '_solution.json');
                                // stream.pipe(res);
                            });


					        // Respond on process close
					        // otherwise, async problems!
					        // res.send(results);
					    });
					}
				});
			});
		}
	});
});

module.exports = router;
