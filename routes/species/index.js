var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var response = App.Lib('responseGenerator');
var Species = App.Model('species');

var columns = ["DOMAIN", "PHYLUM", "CLASS", "ORDER", "FAMILY", 
				"GENUS", "SPECIES", "STRAIN", "MISC", "GENOME"];

var addSpecie = function(req, res, next) {
    var row = {};
	for(var i = 0; i < columns.length; i++){
		row[columns[i]] = req.body[columns[i]].toLowerCase();
	}
	var specie = new Species(row);
	specie.save(row, function(err, savedSpecie){
		if(err)
			response.send500(err.toString(), res);
		else
			res.send("Added\n")
	});	    
}

var retrieveElement = function(req, res, next) {
	var columnName;
	for(var i = 0; i < columns.length; i++){
		if(req.query[columns[i]])
			columnName = columns[i];
	}
	if(!columnName){
		response.send404(res);
	}else{
		Species.find(req.query, function(err, data){
			if(err)
				response.send500(err.toString(), res);
			else if(data === [])
				response.send404(res);
			else
				res.send(data);
		});
	}
	
}


router.get('/retrieve', retrieveElement);
router.post('/create', addSpecie)


module.exports = router;