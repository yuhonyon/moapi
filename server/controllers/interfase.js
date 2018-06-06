const defaultInterfase =require('./../data/interfase.json')
const InterfaseModel =require("../models/interfase")
class Interfase {
  constructor(){

    this.addInterfase=this.addInterfase.bind(this);
  }




  async addInterfase(ctx, next){

    const interfaseInfo={
      ...defaultInterfase,
      ...ctx.request.body,
      id:Date.now()
    }

    await InterfaseModel.addInterfase(interfaseInfo);

    ctx.body={message:"添加成功"}
  }






  async updateInterfase(ctx, next) {
    await InterfaseModel.updateInterfase(ctx.params.interfaseId,ctx.request.body)
    ctx.body = {
      message: "更新成功",
    };

  }

  async deleteInterfase(ctx, next) {

    await InterfaseModel.deleteInterfase(ctx.params.moduleId,ctx.params.interfaseId);
    ctx.body = {message:"删除成功"};
  }

}

module.exports=new Interfase()
