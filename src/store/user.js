import {observable, action, useStrict,runInAction} from 'mobx';
import fetchApi from "@/api"

useStrict(true)
class User {
  @observable userInfo = {
    name:"",
    phone:'',
    accessToken:'',
    type:''
  };

  @observable  userList=[]


  @action.bound
  getUserInfo(){
    return fetchApi.fetchUserInfo().then((data)=>{
      window.localStorage.setItem('user',JSON.stringify(data));
      runInAction(()=>{
        this.userInfo=data;
      })
      return data
    })
  }


  @action.bound
  signout(){
    return fetchApi.fetchSignout().then((data)=>{
      window.localStorage.removeItem('user');
      runInAction(()=>{
        this.userInfo={};
      })
      return data
    })
  }

  @action.bound
  signin(info){
    return fetchApi.fetchSignin(info).then(data=>{
      runInAction(()=>{
        this.userInfo=data;
      })
      window.localStorage.setItem('user',JSON.stringify(data))
      fetchApi.http.updateToken(data.accessToken)
      return data;
    })
  }

  @action.bound
  signup(info){
    return fetchApi.fetchSignup(info).then(data=>{
      runInAction(()=>{
        this.userInfo=data;
      })
      window.localStorage.setItem('user',JSON.stringify(data))
      fetchApi.http.updateToken(data.accessToken)
      return data;
    })
  }

  @action.bound
  delUser(){

  }
  @action.bound
  getUserList(){
    return fetchApi.fetchGetUserList().then(data=>{
      runInAction(()=>{
        this.userList=data;
      })
      return data;
    })
  }




}

const user=new User();

export default user;
