var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PhylumSchema = new Schema({
	ename: {
		type: String,
		required: true
	},
	cparent: {
		type: Schema.Types.ObjectId,
		ref:'domain'
	},
	members: {
		type: [Schema.Types.ObjectId],
		ref: 'class'
	}
});
module.exports = mongoose.model('phylum', PhylumSchema);