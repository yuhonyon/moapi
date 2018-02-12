const Koa = require('koa');
const app = new Koa();
require('koa-validate')(app);
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('koa-cors');
const session = require('koa-session');
const fs = require('fs');
const path = require('path');




//db
var mongoose = require('mongoose');
var bluebird = require('bluebird');
mongoose.Promise = bluebird;
mongoose.connect('mongodb://127.0.0.1:27017/koadb',{useMongoClient: true});
const modelsPath = path.join(__dirname, '/models');
var walk = function(modelPath) {
  fs.readdirSync(modelPath).forEach(function(file) {
    var filePath = path.join(modelPath, '/' + file);
    var stat = fs.statSync(filePath);

    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(filePath);
      }
    } else if (stat.isDirectory()) {
      walk(filePath);
    }
  });
};
walk(modelsPath);


//routes
const index = require('./routes/index');
const users = require('./routes/users');

// error handler
onerror(app);

// middlewares
app.keys = ['zhangivon'];
app.use(cors());
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(session(app));
app.use(require('koa-static')(path.join(__dirname ,'/public')));
//app.use(require('koa-static')(path.join(__dirname ,'../build')));
app.use(views(path.join(__dirname , '/views'), {extension: 'ejs'}));

// logger
app.use(async(ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

module.exports = app;
