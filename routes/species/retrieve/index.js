var express  = require('express');
var router   = express.Router();
var retrieve = App.Lib('speciesRetrieve');


var retrieveElement = function(req, res, next) {
	retrieve(req.query, function(err, data){
		if(err)
			return res.send(err);
		res.send(data)
	})
	
}


router.get('/', retrieveElement);

module.exports = router;