var mongoose = require('mongoose');

var CommunitySchema = new mongoose.Schema({
    name: String,
    members: [{
        model: String // valid model id
    }]
});

module.exports = mongoose.model('community', CommunitySchema);
