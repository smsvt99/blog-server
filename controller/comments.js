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
    if(!hasRole(req, res, ['ADMIN', 'USER'])) return;
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
