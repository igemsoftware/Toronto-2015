var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FamilySchema = new Schema({
	cname:{
		type:String,
		default: 'family'
	},
	ename:{
		type:String,
		required: true
	},
	cparent:{
		type: Schema.Types.ObjectId,
   	 	ref: 'Order'
	},
	members: {
		type: [Schema.Types.Mixed]
	}
});
module.exports = mongoose.model('Family', FamilySchema);