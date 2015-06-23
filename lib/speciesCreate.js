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
var saveElementPC = function(elementChildModel, elementParent, ColumnParent, callback) {
    ColumnParent.findOne({
        ename: elementParent.ename
    }, function(err, item) {
        if (err)
            return callback(err);
		var elementParentModel = item;
        //If item exist, push the current object id to the member of the above
        if (elementParentModel) {
            elementParentModel.members.push(elementChildModel._id);
            elementChildModel.cparent = elementParentModel._id;
        } else {
            elementParentModel = new ColumnParent(elementParent);
            elementParentModel.members.push(elementChildModel._id);
        }
        elementParentModel.save(function(err, savedParent) {
            if (err)
                return callback(err);
            elementChildModel.cparent = savedParent._id;
            elementChildModel.save(function(err,savedChild) {
                if (err)
                    return callback(err);
                callback(savedParent);

            });
        });
    });
}

var addSpecieRecursion = function(row, savedChildModel) {
        if (row.columnsToBeFilled.length > 0) {
            var columnName = row.columnsToBeFilled.pop();
            var elementParent = {
                ename: row[columnName]
            }
            var Column = columnJSONList[columnName.toUpperCase()];
            saveElementPC(savedChildModel, elementParent, Column, function(
                savedChildModel) {
                if (savedChildModel !== null)
                    addSpecieRecursion(row, savedChildModel);
            });
        }
    }

//Pass in a JSON object with every paramater, simplifies it for the front end
//We deal with the rest, easier to maintain.
//It'll break if you dont passs in the right column paramaters for the row
//Easy fix, we'd simply check the prototpes so no one fucks with our DB.
//CBA right now to do it.
var addSpecie = function(row, callback) {
    var specie = new Species({
        ename: row['species'],
        strain: row['strain'],
        misc: row['misc'],
        genome: row['genome']
    });
    
    row.columnsToBeFilled = columnOrder.slice();
    specie.save(function(err, savedSpecie) {
		if(err)
			callback(err)
        addSpecieRecursion(row, savedSpecie);
		callback(null, row);
	
    });
}


module.exports = addSpecie;