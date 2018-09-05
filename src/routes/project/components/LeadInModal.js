import { Modal, Button,message } from 'antd';
import React from 'react'
import AceEditor from 'react-ace';
import 'brace/mode/json';
import 'brace/theme/github';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
const ace = require('brace');
const mockSnippets = require('./snippers/mock.snippers')
ace.define('ace/snippets/json', ['require', 'exports', 'module'], function (e, t) {
  t.snippetText = mockSnippets
  t.scope = 'json'
})
const code=`{}`
class LeadInModal extends React.Component {
  state={code:code}
  handleOk = (e) => {
    if(/^\[[\s\S]*\]$/m.test(this.state.code)){
      message.warning('不建议用数组格式数据');
      this.setState({'code':`{"array_type_data":${this.state.code}}`})
      return;
    }
    if(!this.isJSON(this.state.code)){
       message.warning('格式错误');
       return;
    }
    this.props.onOk(this.state.code);
    this.setState({code:`{}`});
    this.props.onClose();
  }
  handleCancel = (e) => {
    this.setState({code:`{}`})
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
    return (
      <div>
        <Modal maskClosable={false}
          width={640}
          title={<span>{this.props.title} <Button onClick={this.handleFormat} size="small">格式化</Button></span>}
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

export default LeadInModal;
