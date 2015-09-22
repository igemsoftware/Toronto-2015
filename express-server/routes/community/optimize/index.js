var router = require('express').Router();
var fs = require('fs');
var Community = App.Model('community');


function sendOptimizedCommunity(req, res, next) {
    Community.findOne({id: req.params.id}, function(err, community) {
        // Get unoptimzed model
        fs.readFile(community.model, function(err, model) {
            if (err) {
                res.status(500).send('500 Internal Server Error');
                return;
            }

            model = JSON.parse(model);

            fs.readFile(community.solution, function(err, solution) {
                if (err) {
                    res.status(500).send('500 Internal Server Error');
                    return;
                }

                solution = JSON.parse(solution);

                // Reactions dictionary
                reactionsDict = {};
                model.reactions.forEach(function(reaction) {
                    reactionsDict[reaction.id] = reaction;
                });

                Object.keys(solution.x_dict).forEach(function(reactionId) {
                    reactionsDict[reactionId].flux_value = solution.x_dict[reactionId];
                });

                // Convert dictionary back to array
                tempReactionsArray = [];
                Object.keys(reactionsDict).forEach(function(reactionId) {
                    tempReactionsArray.push(reactionsDict[reactionId]);
                });

                model.reactions = tempReactionsArray;

                var fileName = App.config().staticStore + '/communities/' + community.name + '_optimized.json';

                fs.writeFile(fileName, JSON.stringify(model), function(err) {
                    if (err) {
                        res.status(500).send('500 Internal Server Error');
                        return;
                    }

                    community.optimizedModel = fileName;

                    community.save(function(err, community) {
                        if (err) {
                            res.status(500).send('500 Internal Server Error');
                            return;
                        }
                        res.send(community.optimizedModel);
                    });
                });
            });
        });
    });
}



router.get('/:id', [
    sendOptimizedCommunity
]);

module.exports = router;
