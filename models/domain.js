var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DomainSchema = new Schema({
	ename: {
		type: String,
		required: true
	},
	members: {
		type: [Schema.Types.ObjectId],
		ref: "phylum"
	}
});
module.exports = mongoose.model('domain', DomainSchema);