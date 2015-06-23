var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GenusSchema = new Schema({
	ename:{
		type:String,
		required: true
	},
	cparent:{
		type: Schema.Types.ObjectId,
		ref: 'family'
	},
	members: {
		type: [Schema.Types.ObjectId],
		ref: 'species'
	}
});
module.exports = mongoose.model('genus', GenusSchema);