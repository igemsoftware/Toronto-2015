var router = require('express').Router();
var mongoose = require('mongoose');
var Species = App.Model('species');
var Model = App.Model('model');
var fs = require('fs');

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

function compareFlux(req, res, next){
    var id1 = req.body.id1
    var id2 = req.body.id2

    Model.findOne({id: id1}, function(err, model1){
        if(err)
            return console.log(err)


        Model.findOne({id: id2}, function(err, model2){
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

                    var compared = {}
                    for(var model1key in model1data.x_dict){
                        for(var model2key in model2data.x_dict){
                            if(model1data.x_dict[model2key]){
                                compared[model2key] = model2data.x_dict[model2key] - model1data.x_dict[model2key]
                            }
                        }
                    }
                    res.send(compared)
                })
            })
        })
    })
}

router.post('/', compareFlux);

module.exports = router;
