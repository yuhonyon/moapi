const koaRouter =require('koa-router');
const Interfase =require('../controllers/interfase');



const router=koaRouter()
router.prefix('/interfase');

router.put('/:interfaseId',Interfase.updateInterfase);
router.delete('/:moduleId/:interfaseId',Interfase.deleteInterfase);
router.post('/',Interfase.addInterfase);


module.exports=router
