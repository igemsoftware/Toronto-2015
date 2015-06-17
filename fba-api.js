var express = require('express');
var colors  = require('colors');
var config  = require('./config');

var app = express();

app.get('/', function(req, res) {
    res.send('GET request at `/`');
});

app.listen(config.port);
console.log('Express server listening on port ' + config.port.toString().blue);
