const mongoose = require("mongoose"),
      Schema   = mongoose.Schema,
      bcrypt   = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 20
  },
  email: {
    type: String,
    required: true,
    validate: {
        validator: (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email),
        message: "Please enter a valid email"
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
  role: {
    type: String,
    required: true,
    enum: {
        values: ['USER', 'ADMIN', 'GUEST'],
        message: '{VALUE} is not supported'
      }
  },
  notify: {
    type: Boolean,
    required: true
  }
});

userSchema.methods.isValidLogin = async function(input){
    return await bcrypt.compare(input, this.password);
}

userSchema.methods.getHashedPassword = async function(){
    const salt    = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    return bcrypt.hash(this.password, salt);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
