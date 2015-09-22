var serveIndex = require('serve-index'),
    colors = require('colors');

// ==== Express ====
var express = require('express');
var app = express();

// ==== App ====
var App = global.App = require('./lib/App');

// ==== DB Connection ====
connection = App.Lib('connection');
connection.mongodb();

// ==== Apply global middleware ====
App.MW('global-middleware').apply(app);

// ==== Initialize Routes (and middlewares)  ====
App.Lib('router').init(app);

// ==== Static Server ====
app.use('/static', serveIndex(App.config().staticStore));
app.use('/static', express.static(App.config().staticStore));

// ==== Listen ====
var port = App.config().port;
app.listen(port);
console.log('Express server listening on port ' + port.toString().blue);
