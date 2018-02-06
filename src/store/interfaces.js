import {observable, action, useStrict} from 'mobx';
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
  changeRes(code) {
    if (typeof code === 'string') {
      code = JSON.parse(code)
    }
    this.details.res=code;
  }

  @action.bound
  changeReq(code) {
    if (typeof code === 'string') {
      code = JSON.parse(code)
    }
    this.details.req=code;
  }

  @action.bound
  addValue({type,key,value}) {
    console.log(type,key,value)
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
      target.children.push(value)
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

export default new Interface()
