const Mock =require('mockjs');
const {_ToCamelcase} =require("./camelcase")
function toMock(json){
  let data={};
  function formatMock(item){
    try{
    if(!item.children||item.children.length===0||item.mockValue){
      if(item.mockValue){
        if(item.mockType==='Array'&&/^\[[\s\S]*\]$/m.test(item.mockValue)){
          return JSON.parse(item.mockValue)
        }else if(item.mockType==='Object'&&/^{[\s\S]*}$/m.test(item.mockValue)){
          return JSON.parse(item.mockValue)
        }else if(item.mockType==='String'){
          return ""+item.mockValue
        }else if(item.mockType==='Number'&&/^[0-9.+-]*$/m.test(item.mockValue)){
          return Number(item.mockValue)
        }else if(item.mockType==='Boolean'&&/^true|false$/m.test(item.mockValue)){
          return JSON.parse(item.mockValue)
        }else{
          return item.mockValue
        }

      }else{
        if(item.type==='Array'){
          return []
        }else if(item.type==='Object'){
          return {}
        }else if(item.type==='String'){
          return ""
        }else if(item.type==='Number'){
          return 0
        }else if(item.type==='Boolean'){
          return false
        }else{

        }
      }
      return ""
    }
    let data={};
    for(let child of item.children){
      data[child.name+(child.mockNum&&"|"+child.mockNum)]=formatMock(child);
    }

    if(item.mockType==='Array'){
       return [data]
    }else{
      return data;
    }
  }catch(e){
    return item.mockValue
  }
  }

  for(let item of json){
    data[item.name+(item.mockNum&&"|"+item.mockNum)]=formatMock(item);
  }

  return JSON.stringify(Mock.mock(data),null,2)
}


function testHeader(interfase) {
    if(!interfase.headers.length===0){
      return ""
    }
     let data=[];
     for(let item of interfase.headers){
       data.push({"enabled":true,"key":item.name,"value":item.value})
     }
     return encodeURI(JSON.stringify(data));
 }

 function testReq(interfase) {
       let method=interfase.method.toUpperCase();
      if(!interfase.req.length===0){
        return ""
      }
      let mockData=JSON.parse(interfase.mockReq);
      if(method==="POST"||method==="PUT"){
        return "&body="+encodeURIComponent(JSON.stringify(mockData,null,2));
      }else{
        let data=[];
        for(let key in mockData){
          data.push({"enabled":true,"key":key,"value":mockData[key]})
        }
        return "&queryParameters="+encodeURI(JSON.stringify(data));
      }
  }



function getMdData(json){
  json=_ToCamelcase(json);

  for(let module of json.modules){
    for(let interfase of module.interfases){
      interfase.mockReq=toMock(interfase.req)
      interfase.mockRes=toMock(interfase.res)
      interfase.req=format(interfase.req)
      interfase.res=format(interfase.res)
      interfase.testUrl=(`http://127.0.0.1:3015/project/test/${interfase.url}#!method=${interfase.method.toUpperCase()}&headers=${testHeader(interfase)}${testReq(interfase)}`).replace(/([^:])\/\//,"$1/");


    }
  }



  function format(arr){
    if(!arr||!arr.length){
      return []
    }
    let newArr=[];
    let placeholder="";
    function push(item){
      let hasChildren=item.children&&item.children.length>0;
      newArr.push({
        "key": item.key,
        "name":(hasChildren?placeholder+"Θ&nbsp;":placeholder)+item.name,
        "type": item.type,
        "required": item.required,
        "mockType": item.mockType,
        "mockNum": item.mockNum,
        "mockValue": item.mockValue,
        "description": item.description
      });
      if(hasChildren){
        placeholder+="&emsp;&emsp;"
        for(let i of item.children){
          push(i)
        }
      }
    }
    for(let item of arr){
      placeholder=""
      push(item);
    }
    return newArr;
  }

  return json
}


module.exports={toMock,getMdData}
