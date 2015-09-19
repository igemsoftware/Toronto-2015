module.exports = mongoose.model('metabolicmodel', new mongoose.Schema({
	reactions: [{
		subsystem: String,
		name: String,
		upper_bound: Number,
		lower_bound: Number,
		objective_coefficient: Number,
		variable_kind: String,
		id: String,
		gene_reaction_rule: String,
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
}));
