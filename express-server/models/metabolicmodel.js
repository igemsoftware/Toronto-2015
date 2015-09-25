var mongoose = require('mongoose');
var fs = require('fs');


var MetabolicModelSchema = new mongoose.Schema({
    // NOTE id is the primary key
    id: {
        type: String,
        unique: true
    },
    file: String,
	reactions: [{
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
	description: String,
 	notes: String,
  	genes: [{
		name: String,
		id: String
	}],
  	metabolites: [{
		name: String,
		notes: String,
		annotation: String,
		_constraint_sense: String,
		charge: Number,
		_bound: Number,
		formula: String,
		compartment: String,
		id: String,
        species: [{
            name: String
        }],
        subsystems: [{
            name: String
        }]
	}]
});

MetabolicModelSchema.methods.transform = function transform(cb) {
	var model = JSON.parse(JSON.stringify(this));
	model.reactions.forEach(function(reaction) {
		metabolitesDict = {};
	    reaction.metabolites.forEach(function(metabolite) {
			metabolitesDict[metabolite.id] = metabolite.stoichiometric_coefficient;
		});
		reaction.metabolites = metabolitesDict;

        speciesArray = [];
        reaction.species.forEach(function(specie) {
            speciesArray.push(specie.name);
        });
        reaction.species = speciesArray;


        // Give reaction.flux_value as 0 if non-existent
        // TODO do this form python
        if (!reaction.flux_value) {
            reaction.flux_value = 0;
        }
	});

    model.metabolites.forEach(function(metabolite) {
        speciesArray = [];

        metabolite.species.forEach(function(specie) {
            speciesArray.push(specie.name);
        });

        metabolite.species = speciesArray;

        subsystemsArray = [];
        metabolite.subsystems.forEach(function(subsystem) {
            subsystemsArray.push(subsystem.name);
        });
        metabolite.subsystems = subsystemsArray;
    });

	cb(model);
};

module.exports = mongoose.model('metabolicmodel', MetabolicModelSchema);
