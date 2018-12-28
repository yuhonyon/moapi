import React from 'react';
import {Button,message} from 'antd'
import Style from "./ShowCode.less"
import copy from 'copy-to-clipboard';


class ShowCode extends React.Component{
  handleCopy=()=>{
    this.props.code
    if(copy(this.props.code)){
      message.success("复制成功")
    }
  }
  render(){
    return <div className={Style.wrapper}>
      <div className={Style.header}><span>{this.props.title}</span><Button onClick={this.handleCopy} style={{"float":"right"}} size="small" icon="copy">复制</Button></div>
      <div style={{'maxHeight':this.props.maxHeight||1000}} className={Style.main}>
        <pre>
          {this.props.code}
        </pre>
      </div>
    </div>
  }
}

export default ShowCode;
