var router = require('express').Router();

router.get('/', function(req, res) {
    res.send('in the lab!\n');
})

router.get('/bench', function(req, res) {
    res.send('at the bench\n');
})

module.exports = router;
