var mongoose = require('mongoose');

var SpeciesSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    // Array of model._ids
    models: {
        type: [{
            type: mongoose.Schema.ObjectId,
            ref: 'model'
        }]
    },
    DOMAIN: {
        type: String,
        required: true
    },
    PHYLUM: {
        type: String,
        required: true
    },
    CLASS: {
        type: String,
        required: true
    },
    ORDER: {
        type: String,
        required: true
    },
    FAMILY: {
        type: String,
        required: true
    },
    GENUS: {
        type: String,
        required: true
    },
    SPECIES: {
        type: String,
        required: true
    },
    STRAIN: {
        type: String
    },
    MISC: {
        type: String
    },
    GENOME: {
        type: String
    }
});


module.exports = mongoose.model('species', SpeciesSchema);
