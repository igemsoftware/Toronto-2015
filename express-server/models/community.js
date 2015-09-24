var mongoose = require('mongoose');

var CommunitySchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    members: [{
        model: String, // valid model id
        file: String
    }],
    file: String,
    solution: String,
    optimizedModel: String
});

module.exports = mongoose.model('community', CommunitySchema);
