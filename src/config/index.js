import defaultConfig from './config';

let config=defaultConfig;

if(window.globalConfig){
  config={...config,...window.globalConfig};
}

if(!/\/$/.test(config.baseURL)){
  config.baseURL=config.baseURL+"/"
}


export default config;
