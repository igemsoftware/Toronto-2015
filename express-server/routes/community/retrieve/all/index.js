var router = require('express').Router();

var Community = App.Model('community');

function sendAllCommunities(req, res, next) {
    Community.find().exec(function(err, communities) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }
        if (communities.length === 0) {
            res.status(403).send('No communities\n');
            return;
        } else {
            console.log(communities)
            res.send(communities);
        }
    });
}

router.get('/', sendAllCommunities);

module.exports = router;
