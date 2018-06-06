const koaRouter =require('koa-router');
const Project =require('../controllers/project');

const router=koaRouter()
router.prefix('/project');



router.get('/:projectId',Project.getProject);
router.post('/',Project.addProject);
router.put('/:projectId',Project.updateProject);
router.delete('/:projectId',Project.deleteProject);


module.exports=router
