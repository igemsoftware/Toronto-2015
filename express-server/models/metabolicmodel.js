var mongoose = require('mongoose');

var MetabolicModelSchema = new mongoose.Schema({

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
		id: String
	}],
  	id: String
});

MetabolicModelSchema.methods.dictifyReactionMetabolites = function dictifyReactionMetabolites(cb) {
	var model = JSON.parse(JSON.stringify(this));

	model.reactions.forEach(function(reaction) {
		metabolitesDict = new Object();

		reaction.metabolites.forEach(function(metabolite) {
			metabolitesDict[metabolite.id] = metabolite.stoichiometric_coefficient;
		});

		reaction.metabolites = metabolitesDict;
	});

	cb(model);
}

module.exports = mongoose.model('metabolicmodel', MetabolicModelSchema);
