const {getProject,saveProject} =require("../utils/")
class Interfase{
  async addInterfase(info){
    let project=await getProject();
    project.modules[info.moduleId].interfases[info.id]=info;
    await saveProject(project)
  }
  async updateInterfase(interfaseId,info){
    let project=await getProject();
    project.modules[info.moduleId].interfases[interfaseId]={...project.modules[info.moduleId].interfases[interfaseId],...info};
    await saveProject(project)
  }
  async deleteInterfase(moduleId,interfaseId){
    let project=await getProject();
    delete project.modules[moduleId].interfases[interfaseId]
    await saveProject(project)
  }
}



module.exports=new Interfase();
