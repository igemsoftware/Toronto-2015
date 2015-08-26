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

var connectMysql = function(cb) {
    var mysqlConnection = mysql.createConnection(App.config().mysql);

    mysqlConnection.connect(function(err) {
        if (err) {
            console.log('MySQL failed to connect'.red)
            return;
        }

        console.log('MySQL connected successfully as id '.green + mysqlConnection.threadId.toString().blue);
        // Pass connection into callback
        cb(mysqlConnection);
    });


    // stuff like this shouldn't happen here.
	mysqlConnection.query('SELECT 1', function(err, rows) {
		if (err) {
			console.log(err.stack);
		}
		else {
			console.log("YAYAYAYAYAYAYAYA");
		}
	});

    // can create a end function inside connection.js later
	mysqlConnection.end();
	console.log("Successful MySQL Termination".green);
}

module.exports = {
    mongodb: function() {
        mongodb();
    },
    mysql: function(connection) {
        connectMysql(connection);
    }
};
