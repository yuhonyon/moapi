import { observable, action ,useStrict,computed,runInAction} from 'mobx';
import fetchApi from  '@/api'
useStrict(true);

class ProjectList {
  @observable all = [] ;
  @observable self = [] ;
  @observable relate = [] ;
  @observable develop=[];


  @action.bound
  getProjectList(){
    return fetchApi.fetchGetProjectList().then(data=>{
      runInAction(()=>{
        this.all=data;
      })
      return data;
    })
  }

  @action.bound
  getSelfProjectList(){
    return fetchApi.fetchGetSelfProjectList().then(data=>{
      runInAction(()=>{
        this.self=data;
      })
      return data;
    })
  }

  @action.bound
  getDevelopProjectList(){
    return fetchApi.fetchGetDevelopProjectList().then(data=>{
      runInAction(()=>{
        this.develop=data;
      })
      return data;
    })
  }




  @action.bound
  getRelateProjectList(){
    return fetchApi.fetchGetRelateProjectList().then(data=>{
      runInAction(()=>{
        this.relate=data;
      })
      return data;
    })
  }

  @action.bound
  addProject(project){
    return fetchApi.fetchAddProject(project).then(data => {
      return data;
    })
  }

  @action.bound
  editProject(){

  }

  @action.bound
  delProject(projectId){
    return fetchApi.fetchDeleteProject(projectId).then(data => {
      return data;
    })
  }
}


export default new ProjectList();
