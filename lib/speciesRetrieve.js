var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

var Species = App.Model('species');
var Genus   = App.Model('genus');
var Family  = App.Model('family');
var Order   = App.Model('order');
var Class   = App.Model('class');
var Phylum = App.Model('phylum');
var Domain  = App.Model('domain');

var columnOrder = ["DOMAIN", "PHYLUM", "CLASS", "ORDER", "FAMILY", "GENUS"];

var columnJSONList = {
        DOMAIN  : Domain,
        PHYLUM  : Phylum,
        CLASS   : Class,
        ORDER   : Order,
        FAMILY  : Family,
        GENUS   : Genus,
        SPECIES : Species
    }
   

//This will find the element, see if it exists, and then save it.
var retrieve = function(query, callback) {
	var Column;
	for(var i = 0; i < columnOrder.length; i++) {
		if(query[columnOrder[i]] !== undefined)
		{
			console.log(columnOrder[i])
			Column = columnJSONList[columnOrder[i]];
		}
	}
	if(Column === undefined)
		return callback("403");
	
    Column.findOne(query), function(err, item) {
   		if(err)
			return callback("404");
		else{
			callback(null, item)
		}
	}
}


module.exports = retrieve;