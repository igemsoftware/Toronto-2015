var mongoose = require('mongoose');

var ModelSchema = new mongoose.Schema({
    // primary key to construct communities
    id: {
        type: String,
        required: true
    },
    // files
    file: {
        type: String,
        required: true
    },
    solution: String,
    optimized: String,
    // added Reaction objects - will need conversions for metabolites and species
    addedReactions: [{
        subsystem: String,
        name: String,
        upper_bound: Number,
        lower_bound: Number,
        objective_coefficient: Number,
        variable_kind: String,
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
