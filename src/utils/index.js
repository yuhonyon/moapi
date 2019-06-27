export function getQuery(search,name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export function mergePath(url1,url2) {
  return url1.replace(/\/$/,'')+'/'+url2.replace(/^\//,'')
}

export function getApiUrl(search,name) {
  let host=window.location.host;
  if(!/127|localhost/.test(host)){
    return window.location.origin+"/api"
  }else{
    return "http://127.0.0.1:9215"
  }
}


export function setCookie(name, value) {
  var exp = new Date();
  exp.setTime(exp.getTime() + 300 * 24 * 60 * 60 * 1000); 
  document.cookie = name + "=" + encodeURIComponent(value)
      + ";expires=" + exp.toGMTString() + ";path=/";
  return true;
}

export function mergeData(oldData,newData,pKey){
  function changeKey(data,key){
    if(!key){
      key=pKey||Date.now();
    }
    for(let i in data){
      key=key+"-"+data[i].name.replace(/-/g,'_');
      data[i].key=key;
      if(data[i].children&&data[i].children.length>0){
        data[i].children=changeKey(data[i].children.slice(),key)
      }
    }
    return data;
  }
  function merge(a,b){
    if(!b||b.length===0){
      return a;
    }
    if(!a){
      return changeKey(b,Date.now()+parseInt(Math.random()*10000000000));
    }
    for(let i in b){
      const index=a.findIndex(item=>(item.name===b[i].name));
      if(index>=0){
        if(a[index].children&&a[index].children.length>0){
          a[index].children=merge(a[index].children.slice(),b[i].children);
        }else{
          a[index].children=changeKey(b[i].children, a[index].key)
        }
      }else{
        a.push(changeKey([b[i]]),a.key);
      }
    }
    return a;
  }
  return merge(oldData,newData);
}