const User = require('../model/user');

exports.GET = async (req, res) => {
    if(req.query._id){
        const user = await User.findById(req.query._id);
        res.send(user);
    } else {
        res.send(await User.find({}));
    }
}

exports.POST = async (req, res) => {
    let response = {};
    try{
        const user = new User({
            role: "USER",
            ...req.body
        });
        user.password = await user.getHashedPassword();
        await user.save();
        response.success = true;
    } catch(e){
        console.log(e);
        response.error = e;
        response.success = false;
    }
    res.send(response);
}

exports.PATCH = async (req, res) => {
    const user = new User(req.body);
    user.password = await user.getHashedPassword();
    await User.findByIdAndUpdate(req.query._id, user);
    user.remove();
    res.send(await User.find({}));    
}

exports.DELETE = async (req, res) => {
    const user = await User.findOneAndDelete(req.query._id);

    res.send(await User.find({}));
}
