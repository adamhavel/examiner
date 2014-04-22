var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema(
   {
      _id: String,
      name: String,
      role: String,
      subjects: [String],
      lastLogin: Date
   },
   {
      autoIndex: false
   }
);

mongoose.model('User', UserSchema);