var router = require('express').Router();

var Model = App.Model('model');

router.get('/:id', function(req,res, next) {
	Model.findOne({id: req.params.id}, function(err, model) {
		if (err) {
			res.status(500).send('500 Internal Server Error\n');
			return;
		}
		if (!model) {
			res.status(204).send('204 no content. That model does not exist.\n');
		} else {
			res.send(model);
		}
	});
});

module.exports = router;
