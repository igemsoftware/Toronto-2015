var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassSchema = new Schema({
	ename:{
		type:String,
		required:true
	},
	cparent: {
		type: Schema.Types.ObjectId,
   	 	ref: 'phylum'
	},
	members: {
		type: [Schema.Types.ObjectId],
		ref: 'order'
	}
});
module.exports = mongoose.model('class', ClassSchema);