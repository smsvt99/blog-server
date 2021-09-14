const passport      = require("passport"),
      LocalStrategy = require("passport-local").Strategy,
      mongoose      = require("mongoose"),
      User          = mongoose.model("User");


exports.strat = new LocalStrategy( async (username, password, done) => {
    console.log("using local strat")
    try{
        const user = await User.findOne({ email: username });
        if (!user) {
            console.log("no such user")
            return done(null, false, { message: "Incorrect username." });
        }
        if (!user.isValidLogin(password)) {
            console.log("found user, pw was wrong")
            return done(null, false, { message: "Incorrect password." });
        }
        console.log("no ifs at local strategy")
        return done(null, user);
    } catch(e){
        console.log(e.message);
    }
  })

exports.serialize = (user, done) => { 
    done(null, user._id); //done(error, user)
}

exports.deserialize = async (_id, done) => {
    const User = mongoose.model("User");
    try{
        user = await User.findById(_id);
        done(null, user); 
    } catch (e){
        done(null, null);
    }
}