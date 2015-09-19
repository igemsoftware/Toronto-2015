var router   = require('express').Router();
var mongoose = require('mongoose');

var response = App.Lib('responseGenerator');
var Species  = App.Model('species');

function appendModel(req, res, next){
    var key = Object.keys(req.body)[0]
    var query = {SPECIES: key}

    Species.findOne(query, function(err, specie) {
        if (err)
            response.send500(err.toString(), res);
        else if (specie === undefined)
            response.send404(res);
        else {
            specie.MODELID = req.body[key]
            console.log(specie)
            specie.save(specie, function(err, savedSpecie){
                if (err)
                    response.send500(err.toString(), res);
                else
                    res.send('Updated ' + savedSpecie + '\n');
            })
        }


    });

}


router.post('', appendModel)


module.exports = router;
