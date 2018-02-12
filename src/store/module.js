import {observable, action, useStrict,computed} from 'mobx';
useStrict(true)
class Module {
  @observable modules = [{
    name:"全局",
    id:1212,
    description:''
  }] ;

  @action.bound
  addModule(){

  }

  @action.bound
  editModule(){

  }

  @action.bound
  delModule(){

  }
}


export default new Module();
