import React from 'react';
import {Icon} from 'antd'
import Style from "./ShowCode.less"



class ShowCode extends React.Component{

  render(){
    return <div className={Style.wrapper}>
      <div className={Style.header}><span>{this.props.title}</span> <Icon type="reload" /></div>
      <div className={Style.main}>
        <pre>
          {this.props.code}
        </pre>
      </div>
    </div>
  }
}

export default ShowCode;
