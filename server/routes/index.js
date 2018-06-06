const interfases =require('./interfases')
const modules =require('./modules')
const projects =require('./projects')

module.exports=app=>{
  app.use(interfases.routes(), interfases.allowedMethods());
  app.use(modules.routes(), modules.allowedMethods());
  app.use(projects.routes(), projects.allowedMethods());
}
