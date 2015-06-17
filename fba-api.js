// ==== Node Modules ====
var express = require('express');
var colors = require('colors');

// ==== App ====
var App = global.App = require('./lib/App');
var port = App.config().port;

// ==== Express ====
var app = express();

// ==== Apply global middleware ====
App.MW('global-middleware')(app);

// ==== test route ====
app.get('/', function(req, res) {
    res.send('GET request at root');
});


// ==== Listen ====
app.listen(port);
console.log('Express server listening on port ' + port.toString().blue);

//module.exports = App;
