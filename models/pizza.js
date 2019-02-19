var mongoose = require("mongoose");

var pizzasSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id: {
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username : String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment" //name of the model ("Comment")
		}
	]
});

module.exports = mongoose.model("pizza", pizzasSchema);
