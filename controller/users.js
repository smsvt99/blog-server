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
    const user = new User(req.body);
    user.password = await user.getHashedPassword();
    await user.save();

    res.send(await User.find({}));
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
