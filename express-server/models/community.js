var mongoose = require('mongoose');

var CommunitySchema = new mongoose.Schema({
    name: String,
    members: [{
        model: String, // valid model id
        file: String
    }]
});

module.exports = mongoose.model('community', CommunitySchema);
