module.exports = function(req, res, next) {
    // the metabolic model
    var metabolicModel = req.ConsortiaFlux.metabolicModel;

    // metabolite dictionary for ease of access
    var metabolitesDict = {};
    metabolicModel.metabolites.forEach(function(metabolite) {
        metabolite.subsystems = [];
        metabolitesDict[metabolite.id] = metabolite;
    });

    // Need to append some items into our metabolicModel first:
    metabolicModel.reactions.forEach(function(reaction) {
        // species array into reactions
        reaction.species = [metabolicModel.id];
        console.log(reaction)
        // Subsystems array into metabolites
        Object.keys(reaction.metabolites).forEach(function(metabolite) {
            if (reaction.subsystem === '') {
                reaction.subsystem = 'Undefined';
            }
            if (metabolitesDict[metabolite].subsystems.indexOf(reaction.subsystem) === -1) {
                metabolitesDict[metabolite].subsystems.push(reaction.subsystem);
            }
        });

        // Default flux_value to 0
        reaction['flux_value'] = 0;
    });
    // species array into metabolites
    metabolicModel.metabolites.forEach(function(metabolite) {
        metabolite.species = [metabolicModel.id];
    });

    next();
};
