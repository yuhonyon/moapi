const mongoose = require('mongoose');
const User = mongoose.model('User');


exports.checkToken = async (ctx, next) => {
  var accessToken = ctx.request.query.accesstoken||ctx.request.body.accesstoken||ctx.request.header.accesstoken;
  console.log(ctx.request.header);
  if (!accessToken) {
    ctx.body = {
      success: false,
      err: '请登录'
    };
    return next;
  }

  var user = await User.findOne({
    accessToken: accessToken
  })
  .exec();

  if (!user) {
    ctx.body = {
      success: false,
      err: '验证失效,请重新登录'
    };
    return next;
  }

  ctx.session = ctx.session || {};
  ctx.session.user = user;

  await next();
};
