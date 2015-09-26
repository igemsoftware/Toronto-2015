var router = require('express').Router();
var mongoose = require('mongoose');
var Community = App.Model('community');
var Model = App.Model('model');
var fs = require('fs');


function compareFlux(req, res, next){

    var id1 = req.body.id1
    var id2 = req.body.id2

    var type = {
        "community": Community,
        "models": Model
    }

    var TypeSchema = type[req.body.type.toLowerCase()]
    TypeSchema.findOne({id: id1}, function(err, model1){
        if(err)
            return console.log(err)

        TypeSchema.findOne({id: id2}, function(err, model2){
            if(err)
                return console.log(err)

            //compare fluxes
            fs.readFile(model1.solution, function(err, model1data){
                if(err)
                    return console.log(err)
                
                fs.readFile(model2.solution, function(err, model2data){
                    if(err)
                        return console.log(err)
                    model1data = JSON.parse(model1data);
                    model2data = JSON.parse(model2data);

                    map(model1.file, function(err, map){
                        if(err)
                            return console.log(err)
                        var compared = {}
                        for(var model1key in model1data.x_dict){
                            for(var model2key in model2data.x_dict){
                                if(model1data.x_dict[model2key]){
                                    compared[map[model2key]] = model2data.x_dict[model2key] - model1data.x_dict[model2key]
                                }
                            }
                        }
                        res.send(compared)
                    })

                })
            })
        })
    })
}
function map(file, callback){
    fs.readFile(file.toString(), function(err, data){
        if(err)
            return callback(err)
        data = JSON.parse(data);
        var reactions = data.reactions
        var map = {}
        for(var i = 0; i < reactions.length; i++){
            map[reactions[i].id] = reactions[i].name
        }
        callback(null, map)
    })
}

router.post('/', compareFlux);

module.exports = router;
