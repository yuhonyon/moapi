import {observable, action, useStrict,runInAction} from 'mobx';
import fetchApi from "@/api"

useStrict(true)
class Home {
  @observable  watchProjectList=[]

  @observable  recordList=[]


  @action.bound
  getRecordList(params={page:1,pageSize:50}){
    if(this.watchProjectList.length===0){
      return;
    }
    params={projectIds:this.watchProjectList.map(item=>item.id).join(","),...params};
    return fetchApi.fetchGetProjectsRecordList(params).then(data=>{
      runInAction(()=>{
        if(params.page&&params.page>1){
          data.data=data.data.concat(this.recordList.data.slice())
        }
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
