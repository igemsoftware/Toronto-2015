var router = require('express').Router();

router.get('/', function(req, res) {
    res.send('Welcome home!\n');
});


module.exports = router;
