const koaRouter =require('koa-router')
const Module =require('../controllers/module')

const router=koaRouter()
router.prefix('/module');




router.delete('/:moduleId',Module.deleteModule);
router.put('/:moduleId',Module.updateModule);
router.post('/',Module.addModule);


module.exports=router
