var MetabolicModel = App.Model('metabolicmodel');

function verifyModelNonExistence(req, res, next) {
	var model = req.body;

	if ( model.id === '' ) {
		res.send('Cannot create model with empty string id\n');
		return;
	}

	MetabolicModel.find({id: model.id}, function(err, foundModel) {
		if (err) {
			res.status(500).send('500 Internal Server Error\n');
			return;
		}

		if (foundModel.length === 0) {
			next()
		} else if (foundModel.length > 1) {
			res.send('Something is wrong. Multiple models with same id.\n');
			return;
		} else {
			res.send('Cannot create model with existing id\n');
			return;
		}
	})
}

module.exports = verifyModelNonExistence;
