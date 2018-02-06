const mongoose = require('mongoose');
const User = mongoose.model('User');
const uuidv4 = require('uuid/v4');
const xss = require('xss');

exports.signup = async(ctx, next) => {
  ctx.checkBody('nickname').notEmpty("昵称不能为空");
  ctx.checkBody('password').notEmpty("密码不能为空");
  ctx.checkBody('phone').isMobilePhone("无效的手机号", ['zh-CN']);
  if (ctx.errors) {
    ctx.status = 400;
    ctx.body = ctx.errors;
    return;
  }
  var phone = xss(ctx.request.body.phone.trim());
  var nickname = xss(ctx.request.body.nickname.trim());
  var password = xss(ctx.request.body.password.trim());
  var user = await User.findOne({phone: phone}).exec();

  if (!user) {
    var accessToken = uuidv4();

    user = new User({nickname: nickname, phone: phone, password: password, accessToken: accessToken});
  } else {
    ctx.status = 400;
    ctx.body = {
      msg: "手机号已经注册过"
    };
    return;
  }
  try {
    user = await user.save();
    ctx.body = {
      success: true
    };
  } catch (e) {
    ctx.body = {
      success: false
    };
    return next;
  }

};

exports.signin = async(ctx, next) => {
  ctx.checkBody('password').notEmpty("密码不能为空");
  ctx.checkBody('phone').notEmpty("手机号不能为空").isMobilePhone("无效的手机号", ['zh-CN']);
  if (ctx.errors) {
    ctx.status = 400;
    ctx.body = ctx.errors;
    return;
  }
  var phone = xss(ctx.request.body.phone.trim());
  var password = xss(ctx.request.body.password.trim());
  var user = await User.findOne({phone: phone}).exec();

  if (!user) {

    ctx.status = 400;
    ctx.body = {
      success: false,
      msg: "该手机号尚未注册"
    };
  } else if (user.password === password) {
    var accessToken = uuidv4();
    User.update({
      phone: phone
    }, {
      accessToken: accessToken
    }, function(err) {});
    user.accessToken = accessToken;
    user.password = "***********";
    ctx.body = {
      success: true,
      userInfo: user
    };

  } else {
    ctx.status = 400;
    ctx.body = {
      success: false,
      msg: "密码错误"
    };
  }

};


exports.signout = async(ctx, next) => {

    var accessToken = ctx.request.query.accesstoken||ctx.request.body.accesstoken||ctx.request.header.accesstoken;
  var user = await User.findOne({accessToken: accessToken}).exec();

  if (!user) {

    ctx.status = 400;
    ctx.body = {
      success: false,
      msg: "用户不存在"
    };
  } else {
    var _accessToken = uuidv4();
    User.update({
      accessToken: accessToken
    }, {
      accessToken: _accessToken
    },function(){
      ctx.body = {
        success: true,
        msg: "退出登录"
      };
    });


  }

};

exports.addUser = async(ctx, next) => {
  ctx.checkBody('nickname').notEmpty("昵称不能为空");
  ctx.checkBody('phone').isMobilePhone("无效的手机号", ['zh-CN']);
  if (ctx.errors) {
    ctx.status = 400;
    ctx.body = ctx.errors;
    return;
  }
  const defaultUser = {
    password: '123456',
    age: 20
  };
  const user = new User(Object.assign({}, ctx.request.body, defaultUser));
  const user2 = await User.addUser(user);
  if (user2) {
    ctx.body = {
      success: true,
      userInfo: user2
    };
  }
};

exports.deleteUser = async(ctx, next) => {
  ctx.checkBody('phone').isMobilePhone("无效的手机号", ['zh-CN']);
  if (ctx.errors) {
    ctx.status = 400;
    ctx.body = ctx.errors;
    return;
  }
  var phone = xss(ctx.request.body.phone.trim());
  var user = await User.findOne({phone: phone}).exec();
  if (!user) {
    ctx.status = 400;
    ctx.body = {
      msg: "删除账号不纯在"
    };
  } else {
    User.remove({phone: phone}).then(() => {
      ctx.body = {
        success: true,
        msg: "删除成功"
      };
    });
  }
};
