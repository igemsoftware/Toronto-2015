var router = require('express').Router();
var fs = require('fs');
var Community = App.Model('community');

function dashify(str) {
    dashedStr = str;
    while (dashedStr.indexOf(' ') !== -1) {
        dashedStr = dashedStr.replace(' ', '-');
    }
    return dashedStr;
}

function sendOptimizedCommunity(req, res, next) {
    Community.findOne({id: req.params.id}, function(err, community) {
        fs.readFile(community.file, function(err, model) {
            if (err) {
                console.log(err);
                res.status(500).send('500 Internal Server Error');
                return;
            }

            // Unoptimzed model
            model = JSON.parse(model);

            fs.readFile(community.solution, function(err, solution) {
                if (err) {
                    console.log(err);
                    res.status(500).send('500 Internal Server Error');
                    return;
                }

                // Solution
                solution = JSON.parse(solution);

                // Reactions dictionary
                reactionsDict = {};
                model.reactions.forEach(function(reaction) {
                    reactionsDict[reaction.id] = reaction;
                });

                // Insert flux values into reactions dictionary
                Object.keys(solution.x_dict).forEach(function(reactionId) {
                    reactionsDict[reactionId].flux_value = solution.x_dict[reactionId];
                });

                // Convert dictionary back to array
                tempReactionsArray = [];
                Object.keys(reactionsDict).forEach(function(reactionId) {
                    tempReactionsArray.push(reactionsDict[reactionId]);
                });
                model.reactions = tempReactionsArray;

                // Custom model type
                model.type = 'community';

                // Write optimized community to disk
                var fileName = App.config().staticStore + '/communities/' + dashify(community.name) + '/' + dashify(community.name) + '_optimized.json';

                fs.writeFile(fileName, JSON.stringify(model), function(err) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('500 Internal Server Error');
                        return;
                    }

                    community.optimizedModel = fileName;

                    community.save(function(err, community) {
                        if (err) {
                            console.log(err);
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
