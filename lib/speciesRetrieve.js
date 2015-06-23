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

var columnOrder = ["domain", "phylum", "class", "order", "family", "genus"];

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
	var columnName;
	for(var i = 0; i < columnOrder.length; i++) {
		if(query[columnOrder[i]])
		{
			columnName = columnOrder[i];
			Column = columnJSONList[columnName.toUpperCase()];
		}
	}
	if(!Column)
		return callback("403, not found");
    Column.findOne({ename: query[columnName]}, function(err, item) {
		console.log(item);
   		if(err)
			return callback("404");
		else{
			callback(null, item)
		}
	});
}


module.exports = retrieve;