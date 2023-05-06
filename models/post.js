const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const schema = new mongoose.Schema({
	postText:String,
	post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
	user_id: String,
	username: String,
	pp: String
},{
    timestamps:true,
});


const Post = mongoose.model('Post', schema);
module.exports = Post;