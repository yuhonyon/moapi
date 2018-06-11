import { Menu,Icon,Modal,message,Upload} from 'antd';
import React  from 'react';
import { Link  } from 'react-router-dom'
import Style from './Header.less'
import {inject, observer} from 'mobx-react';
import {withRouter} from "react-router-dom";
import EditProjectModal from './EditProjectModal'
import config  from '@/config';
import logo from '../assets/img/logo.png'
import intl from "react-intl-universal";
@inject("user","project","projectList")
@observer
class Header extends React.Component{

state={
  editProjectModalShow:false
}

handleLogout=()=>{
  this.props.user.cleanUserInfo();
  this.props.history.push("/login")
}

handleShowMockUrl=()=>{
  Modal.info({
   title: intl.get('header.mockModal.title'),
   content: "http://127.0.0.1:3015/mock/ + "+intl.get('header.mockModal.url'),
 });
}
handleResetProject=()=>{
  Modal.confirm({
   title: intl.get('header.resetModal.title'),
   content: intl.get('header.resetModal.content'),
   onOk:()=> {
     this.props.projectList.delProject(1).then(()=>{
       message.success(intl.get('header.resetModal.success'))
       this.props.project.getProjectData(1)
     })
   },
 });
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

lang=localStorage.getItem("lang")||"zh-CN";


changeLang=()=>{
  localStorage.setItem("lang",this.lang==="en-US"?"zh-CN":"en-US");
  window.location.reload();
}
openEditProjectModal=()=>{
  this.setState({editProjectModalShow:true})
}
closeEditProjectModal=()=>{
  this.setState({editProjectModalShow:false})
}
handleUpdateProjectOk=(info)=>{
  this.props.project.updateProject(this.props.project.projectId,info).then(()=>{
    this.props.project.getProjectData(this.props.project.projectId)
  })
}
handleChange=({file})=>{
  if (file.status !== 'uploading') {
   message.success(intl.get('header.leadInSuccess'))
   this.props.project.getProjectData(1)
 }
}

  render(){
    return (
      <div className={Style.wrapper}>
        <EditProjectModal  onOk={this.handleUpdateProjectOk} onClose={this.closeEditProjectModal}  visible={this.state.editProjectModalShow} ></EditProjectModal>
        <div className={Style.logo}><img src={logo} alt=""/></div>
        <div className={Style.menu}>


        </div>
        <div className={Style.right} >
          <a onClick={this.openEditProjectModal}><Icon type="setting" />{intl.get('header.setting')}</a>
          <a onClick={this.handleResetProject}><Icon type="sync" />{intl.get('header.reset')}</a>

          <Upload
            showUploadList={false}
            onChange={this.handleChange}
            action={`${config.baseURL}project/import`}
            >
             <a ><Icon type="login" />{intl.get('header.leadIn')}</a>
           </Upload>
          <a download href={`${config.baseURL}project/export/`}><Icon type="logout" />{intl.get('header.leadOut')}</a>
          <a download href={`${config.baseURL}project/md/`}><Icon type="file-markdown" />{intl.get('header.markdown')}</a>
          <a target="_blank" href={`${config.baseURL}project/doc/?lang=${this.lang}`}><Icon type="file-text" />{intl.get('header.doc')}</a>
          <a download href={`${config.baseURL}project/server/`}><Icon type="cloud-o" />{intl.get('header.server')}</a>
          <a onClick={this.handleShowMockUrl}><Icon type="link" />{intl.get('header.mock')}</a>
          <a onClick={this.changeLang}>{intl.get('lang')}</a>
        </div>

      </div>

    )
  }
}



export default withRouter(Header)
