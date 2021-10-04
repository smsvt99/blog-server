
const Post    = require('../model/post'),
      {hasRole} = require('../security'),
      Mailer = require('../Mailer');


//query params: _id, stub
exports.GET = async (req, res) => {
    const search = {published: true};
    const fields = {};
    
    if(req.isAuthenticated() && req.user.role === 'ADMIN'){
        delete search.published;
    }
    if(req.query._id){
        search._id = req.query._id
    }
    if(req.query.stub){
        fields.body = 0;
    }

    try{
        let posts = await Post
            .find(search, fields)
            .populate("user", {name: 1})
            .populate("tags")
            .sort({createdAt:'desc'});

        if(req.query._id){
            posts = posts[0];
        }
        res.send(posts);

    } catch (e){
        console.log(e);
    }

}

exports.POST = async (req, res) => {
    let success;
    let post;
    try{
        post = new Post({
            user: req.user._id,
            ...req.body
        });
        post.setObjectIds();
        await post.save();
        success = true;
        if(post.published){
            Mailer.newPost(req.user, post);
        }
    } catch(e){
        console.log(e);
        success = false;
    }
    res.send({success: success});
}

//query params: _id
exports.PATCH = async (req, res) => {
    let success;
    let options = {new: true};
    let newPost = JSON.parse(JSON.stringify(req.body));
    try{
        const oldPost = await Post.findById(req.query._id);
        const publishDraft = oldPost.published === false && newPost.published === true;
        if(publishDraft){
            options.timestamps = false;
            newPost.createdAt = new Date();
            newPost.updatedAt = new Date();
        }
        const post = await Post.findByIdAndUpdate(req.query._id, newPost, options)
        success = true
        if(publishDraft){
            Mailer.newPost(req.user, post);
        }
        
    } catch (e) {
        console.log(e);
        success = false;
    }
    res.send({success: success});    
}

//query params: _id
exports.DELETE = async (req, res) => {
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