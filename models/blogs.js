const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogsSchema = new Schema({
    title: String,
    short_description: String,
    description: String,
    image: { type: String, default: null},
    blog_comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'BlogComment' }]
});

const model = mongoose.model("blogs", blogsSchema);

module.exports = model;