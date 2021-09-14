
const Post    = require('../model/post'),
      {hasRole} = require('../utils')


//query params: _id, stub
exports.GET = async (req, res) => {
    //public
    try{
        if(req.query._id){
            const post = await Post
                .findById(req.query._id)
                .populate("user", {name: 1})
                .populate("tags");
            res.send(post);
        } else {
            const fields = {};
            if(req.query.stub){
                fields.body = 0;
            }
            const posts = await Post.find({}, fields)
                .populate("user", {name: 1})
                .populate("tags")
                .sort({'createdAt':'desc'})
            res.send(posts);
        }
    } catch (e){
        console.log(e);
    }

}

exports.POST = async (req, res) => {
    if(!hasRole(req, res, 'ADMIN')) return;
    let success;
    try{
        const post = new Post({
            user: req.user._id,
            ...req.body
        });
        post.setObjectIds();
        await post.save();
        success = true;
    } catch(e){
        console.log(e);
        success = false;
    }
    res.send({success: success});
}

//query params: _id
exports.PATCH = async (req, res) => {
    if(!hasRole(req, res, 'ADMIN')) return;
    let success;
    try{
        const post = await Post.findByIdAndUpdate(req.query._id, req.body);
        success = true
    } catch (e) {
        console.log(e);
        success = false;
    }
    res.send({success: success});    
}

//query params: _id
exports.DELETE = async (req, res) => {
    if(!hasRole(req, res, 'ADMIN')) return;
    let success;
    try{
        const post = await Post.findOneAndDelete({"_id":req.query._id});
        success = true;
    } catch (e){
        console.log(e);
        success = false;
    }
    res.send({success: success});
}