var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DomainSchema = new Schema({
	ename: {
		type: String,
		required: true
	},
	members: {
		type: [Schema.Types.ObjectId]
	}
});
module.exports = mongoose.model('Domain', DomainSchema);