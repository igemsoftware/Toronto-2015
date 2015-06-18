var router = require('express').Router();

function inside(req, res, next) {
    console.log('inside wallberg');
}

function another(req, res, next) {
    console.log('another middleware');
}


router.use(inside, another);

module.exports = {
    middleware: ['inside', 'another'],
    router: router
}
