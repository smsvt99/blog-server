const mongoose = require("mongoose"),
      Schema   = mongoose.Schema;

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    body: {
        type: String,
        required: true,
        minLength: 1,
        maxlength: 1000
    }
},{
    timestamps: true
});


module.exports = mongoose.model("Comment", commentSchema);
