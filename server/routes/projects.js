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
router.all('/test/*',Project.getMock);
router.all('/test',Project.getMock);
router.all('/mock/*',Project.getMock);
router.all('/mock',Project.getMock);



router.get('/project/md/',Project.getMarkDown);
router.get('/project/doc/',Project.getDoc);
router.get('/project/server/',Project.getServer);


router.get('/project/export',Project.exportProject);
router.post('/project/import',upload.single('file'),Project.importProject);
router.get('/project/:projectId',Project.getProject);
router.post('/project/',Project.addProject);
router.put('/project/:projectId',Project.updateProject);
router.delete('/project/:projectId',Project.deleteProject);




module.exports=router
