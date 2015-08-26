var mysql = require('mysql');


var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'secret',
	database : 'tempDB'
});


connection.connect();
console.log("Connected!");
//Shenanigans
connection.end();
