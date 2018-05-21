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
  if(/api\./.test(host)){
    return window.location.protocol+"//api.yfyld.top:"+window.location.port
  }else{
    return "http://127.0.0.1:3014"
  }
}
