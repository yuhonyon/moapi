import defaultConfig from './config';
import {getApiUrl} from "@/utils"

let config=defaultConfig;

if(window.globalConfig){
  config={...config,...window.globalConfig};
}

if(config.baseURL==="auto"){
  config.baseURL=getApiUrl()
}

if(!/\/$/.test(config.baseURL)){
  config.baseURL=config.baseURL+"/"
}


export default config;
