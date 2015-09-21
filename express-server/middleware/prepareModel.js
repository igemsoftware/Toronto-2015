// turn all {}'s into empty strings
function stringify(object) {
	Object.keys(object).forEach(function(key) {
		if ( typeof(object[key]) === 'object' && Object.keys(object[key]).length > 0 ) {
			stringify(object[key]);
		} else if ( typeof(object[key]) === 'object' ) {
			object[key] = '';
		}
	});
}


function prepareModel(req, res, next) {
    console.log(req.ConsortiaFlux.model.id);

    stringify(req.body);

    model = req.ConsortiaFlux.model;

    // Metabolites Dictionary for reference later
    var metabolitesDict = {};
    model.metabolites.forEach(function(metabolite) {
        metabolite.subsystems = [];
        metabolitesDict[metabolite.id] = metabolite;
    });

    // TODO fix same subsystem pushed twice
    // Add subsystems for metabolites
    model.reactions.forEach(function(reaction) {
        Object.keys(reaction.metabolites).forEach(function(metabolite) {
            if (metabolitesDict[metabolite].subsystems.indexOf(reaction.subsystem) === -1) {
                metabolitesDict[metabolite].subsystems.push({
                    name: reaction.subsystem
                });
            }
        });
    });

    // Convert [specie] to [{name: specie}] for reactions
    model.reactions.forEach(function(reaction) {
        // Special case: community objective function has no specie
        if (reaction.name === 'Community biomass objective function') {
            // TODO unique community name, not just 'community', lol, actually nvm.
            reaction.species = ['Community'];
        }

        tempSpecies = [];

        reaction.species.forEach(function(specie) {
            tempSpecies.push({
                name: specie
            });
        });

        reaction.species = tempSpecies;
    });

    // Convert [specie] to [{name: specie}] for metabolites
    model.metabolites.forEach(function(metabolite) {
        tempSpecies = [];

        metabolite.species.forEach(function(specie) {
            tempSpecies.push({
                name: specie
            });
        });

        metabolite.species = tempSpecies;
    });


    // Convert key:Number to {id: key, s_c: Number}
    model.reactions.forEach(function(reaction) {
        // Metabolite conversion
        var tempMetabs = [];

        Object.keys(reaction.metabolites).forEach(function(key) {
            tempMetabs.push({
                id: key,
                stoichiometric_coefficient: reaction.metabolites[key]
            });
        });
        reaction.metabolites = tempMetabs;
    });

    // TODO reaction.species, metabolite.species for single models
    next();
}

module.exports = prepareModel;
