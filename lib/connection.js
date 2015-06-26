var mongoose = require('mongoose');

var init = function() {
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

module.exports = {
    init: function() {
        init();
    }
};
