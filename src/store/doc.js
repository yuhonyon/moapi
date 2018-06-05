import {observable, action, useStrict,runInAction} from 'mobx';
import fetchApi from "@/api"

useStrict(true)
class Doc {
  @observable  data={
    title:null,
    content:null,
    projectName:null,
    id:null,
    projectId:null
  }


  @action.bound
  getDoc(docId=this.data.id){
    return fetchApi.fetchGetDoc(docId).then(data=>{
      runInAction(()=>{
        this.data=data;
      })
      return data;
    })
  }


  @action.bound
  addDoc(params){
    return fetchApi.fetchAddDoc(params).then(data=>{
      return data;
    })
  }

  @action.bound
  updateDoc(docId=this.data.id,params){
    return fetchApi.fetchUpdateDoc(docId,params).then(data=>{
      return data;
    })
  }


  @action.bound
  deleteDoc(docId=this.data.id){
    return fetchApi.fetchDeleteDoc(docId).then(data=>{
      return data;
    })
  }

}

const doc=new Doc();

export default doc;
