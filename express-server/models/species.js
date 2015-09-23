var mongoose = require('mongoose');

var SpeciesSchema = new mongoose.Schema({
    id: {
        type: String,
        require: true
    },
    models: [{
        // primary key to construct communities
        id: String,
        // files
        file: String,
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
            species: [{
                name: String
            }]
    	}],
        // array of deleted Reaction ids
        deletedReactions: [String]
    }],
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
        required : true
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
