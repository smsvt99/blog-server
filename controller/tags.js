const Tag = require('../model/tag');

module.exports.GET = async (req, res) => {
    res.send(await Tag.find({}));
}

exports.POST = async (req, res) => {
    let success;
    try{
        const tag = new Tag(req.body);
        await tag.save();
        success = true;
    } catch(e){
        console.log(e)
        success = false;
    }
    res.send({success: success});
}

exports.PATCH = async (req, res) => {
    let success;
    try{
        const tag = await Tag.findByIdAndUpdate(req.query._id, req.body);
    } catch {
        console.log(e);
        success = false;
    }
    
    res.send({success: success});    
}

exports.DELETE = async (req, res) => {
    let success;
    try{
        const tag = await Tag.findOneAndDelete({_id:req.query._id});
        success = true;
    } catch (e) {
        console.log(e);
        success = false;
    }

    res.send({success: success});
}
