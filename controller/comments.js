const Comment = require('../model/comment');

module.exports.GET = async (req, res) => {
    const search = {};
    if(req.query.post_id){
        search.postId = req.query.post_id
    }
    const comments = await Comment.find(search)
        .populate("user");
    res.send(comments);
    
}

exports.POST = async (req, res) => {
    let success;
    try{
        req.body.postId = mongoose.Types.ObjectId(req.body.postId)
        const comment = new Comment({
            user: req.user._id,
            ...req.body
        });
        await comment.save();
        success = true;
    } catch(e) {
        console.log(e);
        success = false;
    }
    res.send({success: success});
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
