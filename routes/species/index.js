var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

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
		if(err){
			return res.send(err + '\n');
		}
		res.send("Added\n");
	});	    
}

var retrieveElement = function(req, res, next) {
	var columnName;
	for(var i = 0; i < columns.length; i++){
		if(req.query[columns[i]])
			columnName = columns[i];
	}
	if(!columnName){
		return res.send("Invalid search request");
	}
	Species.find(req.query, function(err, data){
		if(err)
			res.send(err)
		else if(data === [])
			res.send("Could not find item");
		else
			res.send(data);
	})
	
}


router.get('/retrieve', retrieveElement);
router.post('/create', addSpecie)


module.exports = router;