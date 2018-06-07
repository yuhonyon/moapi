const {getProject,saveProject} =require("../util/")
class Module{
  async addModule(info){
    let project=await getProject();
    project.modules[info.id]=info
    await saveProject(project)
  }
  async updateModule(moduleId,name){
    let project=await getProject();
    project.modules[moduleId].name=name;
    await saveProject(project)
  }
  async deleteModule(moduleId){
    let project=await getProject();
    delete project.modules[moduleId]
    await saveProject(project)
  }
}



module.exports=new Module();
