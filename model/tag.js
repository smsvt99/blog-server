const mongoose = require('mongoose'),
      Schema   = mongoose.Schema;

const tagSchema = new Schema({
  name: {
      type: String,
      unique : true,
      required : true,
      maxLength: 20
    }
}); 

module.exports = mongoose.model('Tag', tagSchema);