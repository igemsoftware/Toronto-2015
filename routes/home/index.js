var router = require('express').Router();

router.get('/', function(req, res) {
    res.send('Welcome home!\n');
});

router.post('/', function(req, res) {
    res.send('got some mail!');
})

module.exports = {
    routes: [{
        route: '/',
        method: 'GET'
    }, {
        route: '/',
        method: 'POST'
    }],
    router: router
};
