var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  nickname: String,
  age: Number,
  phone: String,
  createTime: Date,
  updateTime: Date,
  accessToken: String,
  password: String
});


UserSchema.pre('save', function(next) {
  if (this.isNew) {
    this.createTime = this.updateTime = Date.now();
  } else {
    this.updateTime = Date.now();
  }
  next();
});

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
