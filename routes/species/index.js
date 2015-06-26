var router   = require('express').Router();
var mongoose = require('mongoose');

var response = App.Lib('responseGenerator');
var Species  = App.Model('species');

var columns = ['DOMAIN', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS', 'SPECIES', 'STRAIN', 'MISC', 'GENOME'];

var addSpecie = function(req, res, next) {
    var row = {}; 
    columns.forEach(function(col) {
        row[col] = req.body[col].toLowerCase();
    })
    
    var specie = new Species(row);
    
    specie.save(row, function(err, savedSpecie) {
        if (err)
            response.send500(err.toString(), res);
        else
            res.send('Added ' + req.body.SPECIES + '\n');
    });
}

var retrieveElement = function(req, res, next) {
    var columnName;
    for (var i = 0; i < columns.length; i++) {
        if (req.query[columns[i]]) {
            columnName = columns[i];
        }
    }
    if (!columnName) {
        response.send404(res);
    } else {
        var query = {};
        query[columnName] = req.query[columnName].toLowerCase();
        Species.find(query, function(err, data) {
            if (err)
                response.send500(err.toString(), res);
            else if (data === [])
                response.send404(res);
            else
                res.send(data);
        });
    }

}

// GET /species/retrieve
router.get('/retrieve', retrieveElement);
// POST /species/create
router.post('/create', addSpecie)

module.exports = router;
