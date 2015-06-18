var router = require('express').Router();

var Chair = App.Model('chair');


var foo = function(req, res, next) {
    console.log('foo');
    next();
}

var welcome = function(req, res) {
    res.send('welcome to wb242\n');
}

router.get('/', foo, welcome);

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

router.put('/chair', function(req, res) {
    res.send('doing some puts on chairs\n');
});



module.exports = router; 
