var mongoose = require('mongoose');
var mysql    = require('mysql');

var mongodb = function() {
    var config = App.config().mongodb;

    var dbUrl = 'mongodb://' + config.username + ':' + config.password + '@' + config.hostname + ':' + config.port + '/' + config.database;

    mongoose.connect(dbUrl);

    mongoose.connection.on('open', function(conn) {
        console.log('Mongoose connected successfully'.green);
    });

    mongoose.connection.on('error', function(err) {
        console.error('MongoDB error: '.red + err.red);
    });
}

var connectMysql = function() {
    var config = App.config().mysql;


	console.log("Hello World");
    var mysqlConnection = mysql.createConnection(config);

    mysqlConnection.connect(function(err) {
        if (err) {
            console.log('MySQL failed to connect'.red)
            return;
        }
        console.log('MySQL connected successfully as id '.green + mysqlConnection.threadId.toString().blue);
        return mysqlConnection;
    });


	mysqlConnection.query('SELECT 1', function(err, rows) {
		if (err) {
			console.log(err.stack);
		}
		else {
			console.log("YAYAYAYAYAYAYAYA");
		}
	});


	mysqlConnection.end();
	console.log("Successful MySQL Termination".green);
}

module.exports = {
    mongodb: function() {
        mongodb();
    },
    mysql: function() {
        connectMysql();
    }
};
