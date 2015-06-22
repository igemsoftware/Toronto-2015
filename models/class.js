var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ClassSchema = new Schema({
	ename:{
		type:String,
		required:true
	},
	cparent: {
		type: Schema.Types.ObjectId,
   	 	ref: 'Phylum'
	},
	members: {
		type: [Schema.Types.Mixed]
	}
});
module.exports = mongoose.model('Class', ClassSchema);