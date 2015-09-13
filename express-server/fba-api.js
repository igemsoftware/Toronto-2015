require('colors');

// ==== Express ====
var express = require('express');
var app = express();

// ==== App ====
var App = global.App = require('./lib/App');

// ==== DB Connection ====
connection = App.Lib('connection')
connection.mongodb(); //wat
// mysqlConn = new Object();
// connection.mysql(function(connection) {
// 	mysqlConn = connection;
// });

// above hasn't finished yet which is this is still {}. #callbacks #yolo
// console.log(mysqlConn)

// ==== Apply global middleware ====
App.MW('global-middleware').apply(app);

// ==== Initialize Routes (and middlewares)  ====
App.Lib('router').init(app);

// ==== Listen ====
var port = App.config().port;
app.listen(port);
console.log('Express server listening on port ' + port.toString().blue);
