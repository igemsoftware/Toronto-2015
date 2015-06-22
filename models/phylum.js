var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PhylumSchema = new Schema({
	cname:{
		type:String,
		default: 'domain'
	},
	ename: {
		type: String,
		required: true,
   	 	ref: 'Domain'
	},
	cparent: {
		type: Schema.Types.ObjectId,
	},
	members: {
		type: [Schema.Types.ObjectId]
	}
});
module.exports = mongoose.model('Phylum', PhylumSchema);