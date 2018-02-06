const router = require('koa-router')();
router.prefix('/api');
router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  });
});
router.get('/img', async (ctx, next) => {
  ctx.body = '../public/images/baidu.png';
});

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string';
});

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  };
});

module.exports = router;
