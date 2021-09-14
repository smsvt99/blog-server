const Comment = require('../model/comment'),
{ authorize } = require('../utils');

module.exports.GET = async (req, res) => {
    //public
    if(req.query.post_id){
        const comment = await Comment.find({postId:req.query.post_id})
            .populate("user");
        res.send(comment);
    } else {
        const comments = await Comment.find({})
            .populate("user");
        res.send(comments);
    }
}

exports.POST = async (req, res) => {
    const comment = new Comment(req.body);
    await comment.save();

    res.send(await Comment.find({}));
}

exports.PATCH = async (req, res) => {
    const comment = await Comment.findByIdAndUpdate(req.query._id, req.body);
    comment.remove();
    res.send(await Comment.find({}));    
}

exports.DELETE = async (req, res) => {
    const comment = await Comment.findOneAndDelete(req.query._id);

    res.send(await Comment.find({}));
}
