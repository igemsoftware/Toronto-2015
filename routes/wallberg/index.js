var router = require('express').Router();

function inside(req, res, next) {
    console.log('inside wallberg');
    next();
}

function another(req, res, next) {
    console.log('another middleware');
    next();
}


router.use(inside, another);

module.exports = router;
