const {getProject,saveProject} =require("../util/")
class Project{
  async addProject(){

  }
  async updateProject(info){
    let project=await getProject();
    project={...project,...info}
    saveProject(project)
  }
  async deleteProject(){
    let project=await getProject();
    project.modules={}
    await saveProject(project)
  }
  async importProject(info){
    await saveProject(info);
  }
  async exportProject(){
    let project=await getProject();
    return project;
  }
  async getProject(){
    let project=await getProject();
    let modules=[];
    for(let moduleId in project.modules){
      let interfases=[];
      for(let interfaseId in project.modules[moduleId].interfases){
        interfases.push(project.modules[moduleId].interfases[interfaseId])
      }
      project.modules[moduleId].interfases=interfases;
      modules.push(project.modules[moduleId])
    }
    project.modules=modules;
    return project;
  }
}



module.exports=new Project();
