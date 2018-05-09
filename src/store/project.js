import { observable, action ,useStrict,computed,runInAction} from 'mobx';
import fetchApi from  '@/api'
import interfases from './interfases'
useStrict(true);


class Project {
  @observable moduleId = null;
  @observable interfaseId = null;
  @observable module = {};
  @observable interfases = [];
  @observable interfase = {};


  @observable data={
    creator:{},
    id:null,
    description:'',
    modules:[{
      name:"院内",
      id:1,
      interfases:[{
        name:"接口一",
        id:1
      }]
    }],
    members:[],
    record:[]
  }

  @computed get modules() {
       return this.data.modules
   }

  @action.bound
  getProjectInfo(projectId){
    fetchApi.fetchGetProjectInfo(projectId).then(data=>{
      runInAction(()=>{
        this.data=data;
        this.selectInterfase()
      })
    })
  }
  @action.bound
  selectInterfase(moduleId,interfaseId){
    if(!moduleId){

      this.moduleId=this.modules.length&&this.modules[0].id;
      this.module=this.modules.length&&this.modules[0];
      this.interfases=this.module.interfases||[];
      this.interfase=(this.interfases.length&&this.interfases[0])||{};
      this.interfaseId=this.interfase.id||null;
    }else if(moduleId&&!interfaseId){
      this.module=this.modules.find(val=>val.id===moduleId)||{}
      this.moduleId=moduleId;
      this.interfases=this.module.interfases||[];
      this.interfase=(this.interfases.length&&this.interfases[0])||{};
      this.interfaseId=this.interfase.id||null;
    }else{
      this.moduleId=moduleId;
      this.module=this.modules.find(val=>val.id===moduleId)||{}
      this.interfases=this.module.interfases||[];
      this.interfaseId=interfaseId;
      this.interfase=this.interfases.find(val=>val.id===interfaseId)||{}
    }

    interfases.getInterfaseData(this.interfase)
  }
}


export default new Project()
