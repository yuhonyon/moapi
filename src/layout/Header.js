import { Menu,Icon} from 'antd';
import React  from 'react';
import { Link  } from 'react-router-dom'
import Style from './Header.less'
import {inject, observer} from 'mobx-react';
import {withRouter} from "react-router-dom";

@inject("user")
@observer
class Header extends React.Component{

handleLogout=()=>{
  this.props.user.cleanUserInfo();
  this.props.history.push("/login")
}
userMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/project" >个人中心</Link>
      </Menu.Item>
      <Menu.Item>
        <span onClick={this.handleLogout}>退出</span>
      </Menu.Item>
    </Menu>
  )

lang=(localStorage.getItem("lang")||"zh-CN")==="zh-CN"?"English":"中文";


changeLang=()=>{
  localStorage.setItem("lang",this.lang==="中文"?"zh-CN":"en-US");
  window.location.reload();
}

  render(){
    return (
      <div className={Style.wrapper}>
        <div className={Style.logo}/>
        <div className={Style.menu}>
          moapi

        </div>
        <div className={Style.right} >
          <a target="_blank"><Icon type="file-text" />设置</a>
          <a target="_blank"><Icon type="file-text" />导入</a>
          <a target="_blank"><Icon type="file-text" />导出</a>
          <a target="_blank"><Icon type="file-text" />下载文档</a>
          <a target="_blank"><Icon type="file-text" />生成server</a>
          <a target="_blank"><Icon type="file-text" />mock地址</a>
        </div>

      </div>

    )
  }
}



export default withRouter(Header)
