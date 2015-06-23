var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SpeciesSchema = new Schema({
	ename:{
		type:String,
		required: true
	},
	cparent:{
		type: Schema.Types.ObjectId,
		ref: 'genus'
		//required:true
	},
	strain: {
		type: String
	},
	misc: {
		type: String
	},
	genome: {
		type: String
	},
	JSONCreated: {
		type: String
	}
});

module.exports = mongoose.model('species', SpeciesSchema);
