// ==== Node Modules ====
var express = require('express');
var colors = require('colors');

// ==== App ====
var App = global.App = require('./lib/App');
var port = App.config().port;

// ==== Express ====
var app = express();

// ==== Apply global middleware ====
App.MW('global-middleware').apply(app);

// ==== Initialize Routes  ====
App.Lib('router').init(app);


// ==== Listen ====
app.listen(port);
console.log('Express server listening on port ' + port.toString().blue);

//module.exports = App;
