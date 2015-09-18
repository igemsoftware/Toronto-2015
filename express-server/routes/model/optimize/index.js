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
				fileName = 'temp/' + req.params.id + '.json';

				fs.writeFile(fileName, JSON.stringify(model), function(err) {
					if (err) {
						res.status(500).send('500 Internal Server Error');
					} else {

						var results = {
					        output   : '',
					        errorlog : '',
					        exitcode : null
					    };

						args = [
							'python-scripts/optimize.py',
							fileName,
							'temp/' + req.params.id
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

					        // Respond on process close
					        // otherwise, async problems!
					        res.send(results);
					    });
					}
				});
			});
		}
	});
});

module.exports = router;
