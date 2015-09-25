var mongoose = require('mongoose');

var ModelSchema = new mongoose.Schema({
    // primary key to construct communities
    id: {
        type: String,
        unique: true,
        required: true
    },
    // files
    file: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    solution: String,
    optimized: String,
    addedMetabolites:[{
        name: String,
        id: String,
        compartment: String,
        species: [String]
    }],
    // added Reaction objects - will need conversions for metabolites and species
    addedReactions: [{
        subsystem: String,
        name: String,
        upper_bound: Number,
        lower_bound: Number,
        objective_coefficient: Number,
        id: String,
        gene_reaction_rule: String,
        // this part is different from key:value in the jsons
        metabolites: [{
            id: String,
            stoichiometric_coefficient: Number
        }],
        species: [String]
    }],
    // array of deleted Reaction ids
    deletedReactions: [String]
});

module.exports = mongoose.model('model', ModelSchema);
