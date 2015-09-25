var mongoose = require('mongoose');

var SpeciesSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    // Array of model._ids
    models: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'model'
        }]
    },
    DOMAIN: {
        type: String
    },
    PHYLUM: {
        type: String
    },
    CLASS: {
        type: String
    },
    ORDER: {
        type: String
    },
    FAMILY: {
        type: String
    },
    GENUS: {
        type: String
    },
    SPECIES: {
        type: String
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
