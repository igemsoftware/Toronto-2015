var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FamilySchema = new Schema({
	ename:{
		type:String,
		required: true
	},
	cparent:{
		type: Schema.Types.ObjectId,
   	 	ref: 'order'
	},
	members: {
		type: [Schema.Types.ObjectId],
		ref: 'genus'
	}
});
module.exports = mongoose.model('family', FamilySchema);