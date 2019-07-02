import { Modal, Button,message ,Cascader} from 'antd';
import React from 'react'
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import {inject, observer} from 'mobx-react';

const ace = require('brace');
const mockSnippets = require('./snippers/mock.snippers')
ace.define('ace/snippets/json', ['require', 'exports', 'module'], function (e, t) {
  t.snippetText = mockSnippets
  t.scope = 'json'
})
const code=`{}`

function getOptions(arr=[]){
  return arr.reduce((total,item)=>{
    if(item.type==="Object"||item.type==="Array"&&!item.mockValue){
      let data={
        value:item.name,
        label:item.name
      }
      if(item.children&&item.children.length){
        data.children=getOptions(item.children)
      }
      total.push(data)
    }
    return total;
  },[])
}

@inject("interfases")
@observer
class LeadInModal extends React.Component {
  state={code:code,target:[]}
  handleOk = (increment) => {
    if(increment){
      alert("未开发完成")
    }
    if(/^\[[\s\S]*\]$/m.test(this.state.code)){
      message.warning('不建议用数组格式数据');
      this.setState({'code':`{"array_type_data":${this.state.code}}`})
      return;
    }
    if(!this.isJSON(this.state.code)){
       message.warning('格式错误');
       return;
    }
    this.props.onOk({code:this.state.code,target:this.state.target,increment});
    this.setState({code:`{}`,target:[]});
    this.props.onClose();
  }
  handleCancel = (e) => {
    this.setState({code:`{}`})
    this.props.onClose();
  }
  handleChange=(newValue)=> {
    this.setState({code:newValue})
  }
  handleOptionsChange=(value)=>{
    this.setState({target:value})
  }
  evil(fn) {
    const Fn = Function;
    return new Fn('return ' + fn)();
  }
  isJSON(str) {
    if(!/^{[\s\S]*}$/m.test(this.state.code)){
      return false;
    }
    if (typeof str === 'string') {
          try {
              JSON.parse(str);
              return true;
          } catch(e) {
              return false;
          }
      }
      return false;
  }
  handleFormat=()=>{
    try{
      let format=this.evil('(' + this.state.code + ')')
      if(format&&format.constructor===Array){
        format={"array_type_data":format}
      }
      format=JSON.stringify(format,'',2)
      this.setState({code:format})
    }catch(err){
      console.log(err)
    }
  }

  render() {
  
    const options=getOptions(this.props.interfases.data[this.props.type])
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title={(<div>{this.props.title} &nbsp;
          <Button onClick={this.handleFormat} size="small">格式化</Button>
          &emsp;<Cascader value={this.state.target} changeOnSelect onChange={this.handleOptionsChange} options={options} placeholder="插入节点 默认跟节点"></Cascader>
          </div>)}
          visible={this.props.visible}
          footer={
            <div>
              <Button onClick={this.handleCancel}>取消</Button>
              <Button onClick={()=>this.handleOk(true)}>增量导入</Button>
              <Button type="primary" onClick={()=>this.handleOk(false)}>提交</Button>
            </div>
          }
        >
          <AceEditor
                mode="json"
                theme="github"
                name="blah2"
                height='300px'
                width='100%'
                onChange={this.handleChange}
                fontSize={14}
                showPrintMargin={true}
                showGutter={false}
                highlightActiveLine={true}
                value={this.state.code}
                setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: false,
                tabSize: 2,
                }}/>

        </Modal>
      </div>
    );
  }
}

export default LeadInModal;
