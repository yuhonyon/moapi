import {observable, action, useStrict,runInAction} from 'mobx';
import fetchApi from "@/api"

useStrict(true)
class Home {
  @observable  watchProjectList=[]

  @observable  recordList=[]


  @action.bound
  getRecordList(){
    let params={projectIds:this.watchProjectList.map(item=>item.id)};
    return fetchApi.fetchGetProjectsRecordList(params).then(data=>{
      runInAction(()=>{
        this.recordList=data;
      })
      return data;
    })
  }



  @action.bound
  getWatchProjectList(){
    return fetchApi.fetchGetWatchProjectList().then(data=>{
      runInAction(()=>{
        this.watchProjectList=data;
        this.getRecordList()
      })
      return data;
    })
  }


  @action.bound
  addWatchProject(params){
    return fetchApi.fetchAddWatchProject(params).then(data=>{
      this.getWatchProjectList()
      return data;
    })
  }

  @action.bound
  deleteWatchProject(params){
    return fetchApi.fetchDeleteWatchProject(params).then(data=>{
      this.getWatchProjectList()
      return data;
    })
  }

}

const home=new Home();

export default home;
