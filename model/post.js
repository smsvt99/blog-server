const mongoose = require("mongoose"),
      Schema   = mongoose.Schema;

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    }],
    published: {
        type: Boolean,
        required: true
    }
}, {
    timestamps: true
});

postSchema.methods.setObjectIds = function(){
    this.user = mongoose.Types.ObjectId(this.user);
    this.tags = this.tags.map(tag => mongoose.Types.ObjectId(tag));
}


module.exports = mongoose.model("Post", postSchema);
