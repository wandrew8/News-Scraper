var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
	headline: {
		type: String,
		required: true,
		unique: true
  },
  	author:{
    	type: String
  },
	summary:{
		type: String,
		required: true,
		unique: true
	},
	link:{
		type: String,
		required: true
  },
  	image: {
    type: String,
  },
	saved: {
		type: Boolean,
    default: false
  },
	notes:[{
		type: Schema.Types.ObjectId,
		ref:"Note"
	}]
});

var Article = mongoose.model("article", ArticleSchema);

module.exports = Article;

