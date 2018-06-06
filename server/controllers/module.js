const defaultModule =require('./../data/module.json')
const ModuleModel =require("../models/module")
class Module {

  async addModule(ctx, next){

    await ModuleModel.addModule({...defaultModule,...ctx.request.body,id:Date.now()});

    ctx.body = {message:"添加成功"};

  }

  async updateModule(ctx, next) {



    await ModuleModel.updateModule(ctx.params.moduleId,ctx.request.body.name)


    ctx.body = {message:"更新成功"};
  }

  async deleteModule(ctx, next) {

    await ModuleModel.deleteModule(ctx.params.moduleId);

    ctx.body ={message:"删除成功"};
  }

}

module.exports=new Module()
