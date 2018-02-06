const router = require('koa-router')();
const User = require('../controllers/user');
const App = require('../controllers/app');
router.prefix('/users');

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users api';
});

router.post('/add',App.checkToken,User.addUser);
router.post('/delete',User.deleteUser);
router.post('/signup',User.signup);
router.post('/signin',User.signin);
router.post('/signout',User.signout);
module.exports = router;
