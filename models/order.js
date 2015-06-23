var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
	ename:{
		type: String,
		required:true
	},
	cparent:{
		type: Schema.Types.ObjectId,
   	 	ref: 'class'
	},
	members: {
		type: [Schema.Types.ObjectId],
		ref:'family'
	}
});
module.exports = mongoose.model('order', OrderSchema)