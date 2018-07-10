export const parseDate=(date, fmt = "yyyy-MM-dd HH:mm:ss")=> {
    if(!date){
      return date
    }
    date=typeof date !== "object"?new Date(date):date;
    var o = {
      "M+": date.getMonth() + 1, //月份
      "d+": date.getDate(), //日
      "h+": date.getHours() % 12 === 0? 12: date.getHours() % 12, //小时
      "H+": date.getHours(), //小时
      "m+": date.getMinutes(), //分
      "s+": date.getSeconds(), //秒
      "q+": Math.floor((date.getMonth() + 3) / 3) //季度
    };
  let week = {"0": "日","1": "一","2": "二","3": "三","4": "四","5": "五","6": "六"};
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1)
      ? (RegExp.$1.length > 2
        ? "星期"
        : "周")
      : "") + week[date.getDay() + ""]);
  }
  if (/(S+)/.test(fmt)) {
    let ms = date.getMilliseconds();
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
      ? (ms)
      : ((RegExp.$1.length === 2)
        ? (("00" + ms).substr(("" + ms).length))
        : (("000" + ms).substr(("" + ms).length))));
  }
  for (let k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (o[k])
        : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }
  return fmt;
}

export  const recordType=(type)=>{
  if(type==="ADD_INTERFASE"){
    return "新增接口"
  }else if(type==="DELETE_INTERFASE"){
    return "删除接口"
  }else if(type==="UPDATE_INTERFASE"){
    return "修改接口"
  }else if(type==="ADD_REMARK"){
    return "添加了备注"
  }else if(type ==="DELETE_REMARK"){
    return "删除了备注"
  }else if(type==="ADD_MODULE"){
    return "新增模块"
  }else if(type==="DELETE_MODULE"){
    return "删除模块"
  }else if(type==="UPDATE_MODULE"){
    return "修改模块"
  }else if(type==="ADD_PROEJECT"){
    return "新增项目"
  }else if(type==="DELETE_PROEJECT"){
    return "删除项目"
  }else if(type==="UPDATE_PROEJECT"){
    return "修改项目"
  }
}


export  const formatDate=(date)=>{
  let diffdate=Date.now()-new Date(date).getTime();
  if(diffdate<60000){
    return parseInt(diffdate/1000,10)+"秒前";
  }else if(diffdate<60000*60){
    return parseInt(diffdate/60000,10)+"分钟前";
  }else if(diffdate<60000*60*24){
    return parseDate(diffdate,"HH小时mm分钟前");
  }else{
    return parseDate(date,"yyyy-MM-dd HH:mm");
  }
}
