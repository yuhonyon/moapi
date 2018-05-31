import { Modal, Button,message } from 'antd';
import React from 'react'

import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';
import {inject, observer} from 'mobx-react';



@inject("project")
@observer
class TemplateModal extends React.Component {
  state={
    code:`{
  "headers":[],
  "res":[],
  "req":[]
}`,

  }
  componentWillReceiveProps(nextProps){
    if(nextProps.visible&&nextProps.visible!==this.props.visible){
      this.setState({code:JSON.stringify(this.props.project.info.template,null,4)})
    }
  }

  handleOk = (e) => {
    if(!this.isJSON(this.state.code)){
       message.warning('格式错误');
       return;
    }
    const code = JSON.parse(this.state.code);
    for(let i in code){
      if((i!=="headers"&&i!=="req"&&i!=="res")||code[i].constructor!==Array){

        message.warning('模板错误');
        return;
      }
    }
    this.props.onOk(code);
    this.props.onClose();
  }
  handleCancel = (e) => {
    this.props.onClose();
  }
  handleChange=(newValue)=> {
    this.setState({code:newValue})
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
      format=JSON.stringify(format,'',2)
      this.setState({code:format})
    }catch(err){
      console.log(err)
    }
  }
  render() {
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title={<span>接口模板 <Button onClick={this.handleFormat} size="small">格式化</Button></span>}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
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

export default TemplateModal;
