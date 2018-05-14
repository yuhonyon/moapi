import axios from 'axios';
import Config from "../config"
import {message} from "antd"
//getToken
const getToken=()=>{
  if (localStorage.getItem('user')) {
        return JSON.parse(localStorage.getItem('user')).token
    }
    return ''
}

//提示
let curMes="";
const _message=(mes)=>{
  if(mes===curMes){
    return;
  }
  message.error(mes,1,()=>{curMes=""})
  curMes=mes;
}

//拦截重复请求(规则:同url同method视为同一请求,必须请求返回结果才能继续请求)
const CancelToken = axios.CancelToken;
let requesting={};
const cancelRequesting=(config)=>{
  let requestId=config.method+config.url.replace(config.baseURL,'').replace(/^\//,'')+JSON.stringify(config.params);
  requesting[requestId]=false;
}
const addRequesting=(config)=>{
  let cancel;
  config.cancelToken=new CancelToken(function executor(c){
    cancel=c;
  });
  let requestId=config.method+config.url.replace(config.baseURL,'').replace(/^\//,'')+JSON.stringify(config.params);

  if(requesting[requestId]){
    cancel({
      message:`重复请求`,
      config:config
    });
    // if(config.method.toUpperCase()!=='GET'){
    //   _message("请勿重复提交")
    // }
    requesting[requestId]=false;
  }else{
    requesting[requestId]=true;
  }

  return config;
}

//loading
let loading;
let loadingNum=0;
const addLoading=function(method){
  if(loadingNum<=0){
    loadingNum=0;
    loading=message.loading(method==='GET'?'加载中':'提交中',3);
  }
  loadingNum++;
}
const removeLoading=function(){
  setTimeout(function(){
    loadingNum--;
    if(loading&&loadingNum<=0){
      loading()
    }
  },0)
}


//实例
const instance = axios.create({
  baseURL: Config.baseURL,
  timeout: 5000,
  headers: {'X-auth-token': getToken(),"Content-Type":"application/json"}
});

instance.updateToken = (token) => {
    instance.defaults.headers['X-auth-token'] = token||getToken()
}

instance.interceptors.request.use( (config) =>{
    if(!config.headers['X-auth-token']){
      instance.updateToken()
    }
    config=addRequesting(config);
    addLoading(config.method.toUpperCase());

    // if(config.method.toUpperCase()==='GET'){
    //
    // }

    return config;
  }, function (error) {

    return Promise.reject(error);
  });


instance.interceptors.response.use( (response)=> {
    cancelRequesting(response.config)
    removeLoading()
    return Promise.resolve(response.data);
  }, function (error) {
    if(error.response){
      cancelRequesting(error.response.config)
    }else{
      requesting={}
    }
    removeLoading()
    if (error.code === 'ECONNABORTED') {
        _message('网络连接超时');
    }else if (error.message === 'Request failed with status code 403'){
        setTimeout(() => {
            window.location.href=window.location.host+"/login"
        }, 1000)
    }else if(error.response&&error.response.data){
      setTimeout(function(){
        _message(JSON.stringify(error.response.data))
      },300);
    }

    return Promise.reject(error);
  });


//重写instance.get
let getFn=instance.get;
instance.get=function(url,data={},config={}){
  config.params=data;
  return getFn(url,config)
}

export default instance;
