var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  nickname: String,
  age: Number,
  phone: String,
  accessToken: String,
  password: String
},{timestamps:true});



UserSchema.statics.findByPhone = async({phone}) => {
  var query = this.find({phone});
  var res = null;
  await query.exec(function(err, user) {
    if (err) {
      res = {};
    } else {
      res = user;
    }
  });
  console.log('res====>' + res);
  return res;
};


UserSchema.statics.addUser = async(user) => {
  user = await user.save();
  return user;
};


var User = mongoose.model("User", UserSchema);
module.exports = User;
