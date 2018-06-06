module.exports= function extend(){
  const _isObject = function(o){
      return Object.prototype.toString.call(o) === '[object Object]';
  }

  const _extend = function self(destination, source,ignore) {
      let property;
      for (property in destination) {
          if (destination.hasOwnProperty(property)) {

              // 若destination[property]和sourc[property]都是对象，则递归
              if (_isObject(destination[property]) && _isObject(source[property])) {
                  self(destination[property], source[property],ignore);
              };

              // 若sourc[property]已存在，则跳过
              if (source.hasOwnProperty(property)&&ignore) {
                  source[property] = destination[property];
              }else if(ignore){
                continue
              } else {
                  source[property] = destination[property];
              }
          }
      }
  }
  let arr = arguments,
      result = {},
      i,
      j=0;

  if (!arr.length) return {};

  if(arr[0]===true){
    if (arr.length===1) return {};
    j=1;
    result={...arr[1]}
  }



  for (i =j; i < arr.length; i++) {
      if (_isObject(arr[i])) {
          _extend(arr[i], result,!!j);
      };
  }

  arr[j] = result;
  return result;
}
