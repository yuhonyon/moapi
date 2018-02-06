import React from 'react';
import {Icon} from 'antd'
import Style from "./CodeEditor.less"



class CodeEditor extends React.Component{

  render(){
    console.log(this.props)
    return <div className={Style.wrapper}>
      <div className={Style.header}><span>{this.props.title}</span> <Icon type="reload" /></div>
      <pre className={Style.main}>
        {this.props.code}
      </pre>
    </div>
  }
}

export default CodeEditor;
