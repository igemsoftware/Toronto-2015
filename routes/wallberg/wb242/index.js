var router = require('express').Router();

router.get('/', function(req, res) {
    res.send('welcome to wb242\n');
});

router.get('/chair', function(req, res) {
    res.send('a chair within wb242\n');
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
