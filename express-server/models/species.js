var mongoose = require('mongoose');

var SpeciesSchema = new mongoose.Schema({
    DOMAIN: {
        type     : String,
        required : true
    }, 
    PHYLUM: {
        type     : String,
        required : true
    },
    CLASS: {
        type     : String,
        required : true
    },
    ORDER: {
        type     : String,
        required : true
    },
    FAMILY: {
        type     : String,
        required : true
    }, 
    GENUS: {
        type     : String,
        required : true
    },
    SPECIES: {
        type     : String,
        required : true,
        index    : {unique : true}
    },
    STRAIN: {
        type: String
    },
    MISC: {
        type: String
    },
    GENOME: {
        type: String
    },
    SMBL: {
        type: String
    }
});


module.exports = mongoose.model('species', SpeciesSchema);
