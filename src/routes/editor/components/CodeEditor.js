import React from 'react';
import {Icon} from 'antd'
import Style from "./CodeEditor.less"
const code=` {
    "a":1
  }
`
class CodeEditor extends React.Component{
  state={code}
  handleChange=this.handleChange.bind(this)
  handleChange(newValue) {
    this.setState({code:newValue})
  }
  render(){
    return <div className={Style.wrapper}>
      <div className={Style.header}><span>{this.props.title}</span> <Icon type="reload" /></div>
      <pre className={Style.main}>
        {this.state.code}
      </pre>
    </div>
  }
}

export default CodeEditor;
