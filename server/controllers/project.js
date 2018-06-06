const ProjectModel =require("../models/project")

class Project {
  constructor() {
    this.addProject = this.addProject.bind(this);
  }
  async addProject(ctx, next) {

  }

  async deleteProject(ctx, next) {
    await ProjectModel.deleteProject();
    ctx.body = "";
  }

  async updateProject(ctx, next) {
    await ProjectModel.updateProject(ctx.request.body);
    ctx.body = "修改成功";
  }


  async getProject(ctx, next) {
    const project=await ProjectModel.getProject();
    ctx.body = project;
  }

}



module.exports=new Project()
