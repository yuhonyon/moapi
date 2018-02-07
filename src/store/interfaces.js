import {observable, action, useStrict,computed,autorunAsync} from 'mobx';
import Mock from 'mockjs';
//import axios from 'axios';
useStrict(true);

class Interface {
  @observable editable = false ;
  @observable showLeadInModal = false ;
  @observable details = {
    name: '全局/业务方',
    methods: "GET",
    url: 'aaa/bbb',
    res: [
      {
        key:'1',
        name: 'list1',
        type: 'Object',
        required: true,
        mockType: 'String',
        mockNum: "1",
        mockValue: 12,
        description: '',
        children:[
          {
            key:"1-2",
            name: 'list12',
            type: 'Object',
            required: true,
            mockType: 'String',
            mockNum: "1",
            mockValue: 12,
            description: ''
          }
        ]
      }
    ],
    req: [{
      key:"2",
      name: 'list1',
      type: 'Object',
      required: true,
      mockType: 'String',
      mockNum: "1",
      mockValue: 12,
      description: ''
    }]
  };

  @observable resCode='';
  @observable reqCode='';

  @computed get resMock() {
       let data={};
       for(let item of this.details.res){
         data[item.name+"|"+item.mockNum]=this.formatMock(item)
       }
       return JSON.stringify(data,null,2);
   }

   @computed get reqMock() {
        let data={};
        for(let item of this.details.res){
          data[item.name+"|"+item.mockNum]=this.formatMock(item)
        }
        return JSON.stringify(data,null,2);
    }



  formatMock(item){
    if(!item.children||item.children.length===0){
      if(this.mockValue){
        return this.mockValue
      }else if(item.type==='Array'){
        return []
      }else if(item.type==='Object'){
        return {}
      }else if(item.type==='String'){
        return ""
      }else if(item.type==='Number'){
        return 0
      }
      return ""
    }
    let data={};
    for(let child of item.children){
      data[child.name+"|"+child.mockNum]=this.formatMock(child);
    }

    if(item.mockType==='Array'){
       return [data]
    }else{
      return data;
    }
  }

  formatCode(key, value,id) {
    let data = {
      key:id,
      name: key,
      type: value?typeof value:"String",
      required: false,
      mockType: value?typeof value:"String",
      mockNum: null,
      mockValue: value,
      description: null
    }
    if (value&&typeof value === 'object') {
      data.children = [];
      if(value.constructor === Array){
        value=value[0];
      }
      let num=0;
      for (let i in value) {
        num++;
        data.children.push(this.fromatCode(i,value,id+'-'+num))
      }
    }
    return data;
  }

  @action.bound
  leadInRes(code) {
    if (typeof code === 'string') {
      code = JSON.parse(code)
    }
    let newCode = [];
    let id=Date.now()
    for (let i in code) {
      newCode.push(this.formatCode(i, code[i],id+i))
    }
    this.details.res=this.details.res.toJS().concat(newCode)
  }

  @action.bound
  leadInReq(code) {
    if (typeof code === 'string') {
      code = JSON.parse(code)
    }
    let newCode = [];
    let id=Date.now()
    for (let i in code) {
      newCode.push(this.formatCode(i, code[i],id+i))
    }
    this.details.req=this.details.req.slice().concat(newCode)
  }


  @action.bound
  changeField(type,value, key, column) {
    const data = this.details[type];
    const keys=key.split('-');
    let curKey='';
    let target={children:data};
    for(let i =0;i< keys.length;i++){
      curKey+=keys[i];
      target = target.children.filter(item => curKey === item.key)[0];
      curKey+="-"
    }
    if (target) {
      target[column] = value;
      if(column==='type'&&(value!=='Array'||value!=='Object')){
        target.children=null;
      }
    }
    this.details[type]=data;
  }

  @action.bound
  delField(type,key) {
    const data = this.details[type];
    const keys=key.split('-');
    let curKey='';
    let target={children:data};

    for(let i =0;i< keys.length;i++){
      curKey+=keys[i];
      if(i===keys.length-1){
        let index = target.children.findIndex(item => curKey === item.key);
        target.children.splice(index,1)
      }else{
        target = target.children.filter(item => curKey === item.key)[0];
      }

      curKey+="-"

    }
    this.details[type]=data;
  }




  @action.bound
  addValue({type,key,value}) {
    if(!key){
      this.details[type].push(value)
      return;
    }
    const keys=key.split('-');
    let curKey='';
    let target={children:this.details[type]};
    for(let i =0;i< keys.length;i++){
      curKey+=keys[i];
      target = target.children.filter(item => curKey === item.key)[0];
      curKey+="-"
    }
    if (target) {
      value.key=key+"-"+value.key;
      if(!target.children){
        target.children=[];
      }
      target.children.push(value)
    }
  }

  @action.bound
  changeCode(type) {
    if(type==='res'){
      this.resCode= JSON.stringify(Mock.mock(JSON.parse(this.resMock)),null,2)
    }else{
      this.reqCode= JSON.stringify(Mock.mock(JSON.parse(this.reqMock)),null,2)
    }

  }



  @action.bound
  openEditable() {
    this.editable = true;
  }
  @action.bound
  closeEditable() {
    this.editable = false;
  }
}

const interfaces= new Interface()

// autorun(()=>{
//     interfaces.changeCode('res')
//     interfaces.changeCode('req')
// })
export default interfaces
