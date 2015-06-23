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

var columnOrder = ["domain", "phylum", "class", "order", "family", "genus", "species"];

var columnJSONList = {
        DOMAIN  : Domain,
        PHYLUM  : Phylum,
        CLASS   : Class,
        ORDER   : Order,
        FAMILY  : Family,
        GENUS   : Genus,
        SPECIES : Species
    }
   

var populateRecursion = function(data, Column, callback){
	if(data.columnsToPop[data.columnsToPop.length - 1] === "species"){
		Column.findOne(data.query, function(err, item){
			if(err)
				return callback(err);
			
			data.row['SPECIES'] = item;
			data.columnsToPop.pop();
			populateRecursion(data, Column, function(err, column){
				if(err)
					return callback(err);
				callback(null, data);
			});
		});
	}else if(data.columnsToPop.length === 0){
		//console.log(data.row);
		callback(null, data.row);
	}else{
	    Column.findOne(data.query).populate('cparent').exec(function(err, element){
	    	var columnName = data.columnsToPop.pop().toUpperCase();
			if(err)
				return callback(err);
			data.row[columnName] = element.cparent.ename;
			data.query = {ename: element.cparent.ename};
			var ColumnParent = columnJSONList[columnName];
			populateRecursion(data, ColumnParent, function(err, column){
				if(err)
					return callback(err);
				callback(null, data);
			});
		
		});
	}
}
//This will find the element, see if it exists, and then save it.
var retrieve = function(query, callback) {
	var Column;
	var columnName;
	for(var i = 0; i < columnOrder.length; i++) {
		if(query[columnOrder[i]]){
			columnName = columnOrder[i];
			Column = columnJSONList[columnName.toUpperCase()];
		}
	}
	if(!Column)
		return callback("403, not found");
	var data = {
		query: {
			ename: query[columnName]
		},
		columnsToPop: columnOrder.slice(),
		row: {
				DOMAIN : null,
        		PHYLUM  : null,
       	 		CLASS   : null,
       	 		ORDER   : null,
        		FAMILY  : null,
        		GENUS   : null,
        		SPECIES : null
			}	
		}
		
	populateRecursion(data, Column, function(err, data){
		if(err)
			return callback(err)
		console.log(data.row);
		callback(null, data.row);
	});
	
}
    



module.exports = retrieve;