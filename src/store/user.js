import {observable, action, useStrict} from 'mobx';
import fetchApi from "@/api"
useStrict(true)
class User {
  @observable userInfo = [{
    nickname:"",
    phone:'',
    accessToken:'',
    type:''
  }] ;

  @action.bound
  signin(info){
  return fetchApi.fetchSignin(info).then(data=>{
    this.userInfo=data;
    return data;
  })
  }

  @action.bound
  signup(){

  }

  @action.bound
  delUser(){

  }
}


export default new User();
