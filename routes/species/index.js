var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var speciesCreate = App.Lib('speciesCreate')

var addSpecie = function(req, res, next) {
    var row = {};
    row.species = req.body.species;
    row.strain = req.body.strain;
    row.genome = req.body.genome;
    row.JSONCreate = req.body.JSONCreate;
    row.domain = req.body.domain;
    row.phylum = req.body.phylum;
    row.class = req.body.class;
    row.order = req.body.order;
    row.family = req.body.family;
    row.genus = req.body.genus;    
	speciesCreate(row, function(err, row){
		if(err)
			res.send(err);
		else
			res.send("done\n");
	});

    
}

router.post('/create', addSpecie)


module.exports = router;