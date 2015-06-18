var mongoose = require('mongoose');

var chairSchema = new mongoose.Schema({
    type: String,
    legs: Number
});

var chairModel = mongoose.model('chair', chairSchema);

module.exports = chairModel;
