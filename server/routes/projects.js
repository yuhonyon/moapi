const koaRouter =require('koa-router');
const Project =require('../controllers/project');
const multer =require('koa-multer');
const path =require("path")
const storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../data/'))
  },
  //修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null,fileFormat[0]+Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})

const upload = multer({ storage: storage });


const router=koaRouter()
router.prefix('/project');
router.all('/test/*',Project.getMock);
router.all('/test',Project.getMock);
router.all('/mock/*',Project.getMock);
router.all('/mock',Project.getMock);
router.get('/md/',Project.getMarkDown);
router.get('/doc/',Project.getDoc);
router.get('/server/',Project.getServer);


router.get('/export',Project.exportProject);
router.post('/import',upload.single('file'),Project.importProject);
router.get('/:projectId',Project.getProject);
router.post('/',Project.addProject);
router.put('/:projectId',Project.updateProject);
router.delete('/:projectId',Project.deleteProject);




module.exports=router
