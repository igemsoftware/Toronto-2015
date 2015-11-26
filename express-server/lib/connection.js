var mongoose = require('mongoose');
var mysql    = require('mysql');

var mongodb = function() {
    var config = App.config().mongodb;

    var dbUrl = 'mongodb://' + config.username + ':' + config.password + '@' + config.hostname + ':' + config.port + '/' + config.database;

    if (config.username === '' && config.password === '' && config.port === '') {
        dbUrl = 'mongodb://' + config.hostname + '/' + config.database;
    }

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
			console.log(err.stack);
			return;
        }

        console.log('MySQL connected successfully as id '.green + mysqlConnection.threadId.toString().blue);
        // Pass connection into callback

        cb(mysqlConnection);
    });


	//This block demonstrates our ability to manipulate MySQL tables in Node
	//I'll move it to a more appropriate place later
	mysqlConnection.query('SELECT * FROM test_table;', function(err, rows, fields) {

		if (err) {
			console.log("yolo");
		}

		else {
			for(var x = 0; x < rows.length; x++) {
				console.log(rows[x]);
			}
		}
	});

	mysqlConnection.end();
}

module.exports = {
    mongodb: function() {
        mongodb();
    },
    mysql: function(connection) {
        connectMysql(connection);
    }
};
