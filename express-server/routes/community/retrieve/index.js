var router = require('express').Router();

var Community = App.Model('community');

router.get('/:id', function(req,res, next) {
	Community.findOne({id: req.params.id}, function(err, community) {
		if (err) {
			res.status(500).send('500 Internal Server Error\n');
			return;
		}
		if (!community) {
			res.status(204).send('204 no content. That community does not exist.\n');
		} else {
			res.send(community);
		}
	});
});

module.exports = router;
