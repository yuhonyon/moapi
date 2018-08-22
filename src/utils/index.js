export function getQuery(search,name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}


export function getApiUrl(search,name) {
  let host=window.location.host;
  if(/91jkys\./.test(host)){
    return window.location.protocol+"//mock.qa.91jkys.com/api"
  }else if(/moapi\./.test(host)){
    return window.location.protocol+"//api.yfyld.online:3030"
  }else if(/97\./.test(host)){
    return "http://97.64.36.18:9215"
  }else{
    return "http://127.0.0.1:9215"
  }
}
