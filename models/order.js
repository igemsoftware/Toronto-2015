var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var OrderSchema = new Schema({
	ename:{
		type: String,
		required:true
	},
	cparent:{
		type: Schema.Types.ObjectId,
   	 	ref: 'Class'
	},
	members: {
		type: [Schema.Types.Mixed]
	}
});
module.exports = mongoose.model('Order', OrderSchema)