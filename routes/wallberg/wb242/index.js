var router = require('express').Router();

var Chair = App.Model('chair');

router.get('/', function(req, res) {
    res.send('welcome to wb242\n');
});

router.get('/chair', function(req, res) {
    var chair = new Chair({
        type: 'relaxing',
        legs: 4
    });

    chair.save(function(err, savedChair) {
        if (err) {
            res.status(500).send('500 Internal Server Error');
            return;
        }

        res.send(savedChair);
    })
})

var foo = function(req, res) {
    res.send('foo\n');
}

module.exports = {
    routes: [{
        route: '/',
        method: 'GET'
    }, {
        route: '/chair',
        method: 'GET'
    }],
    router: router
};
