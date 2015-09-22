var mongoose = require('mongoose');

var CommunitySchema = new mongoose.Schema({
    id: String,
    name: String,
    members: [{
        model: String, // valid model id
        file: String
    }],
    model: String,
    solution: String,
    optimizedModel: String
});

module.exports = mongoose.model('community', CommunitySchema);
