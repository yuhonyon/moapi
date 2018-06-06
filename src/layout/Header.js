import { Menu,Icon,Modal,message,Upload} from 'antd';
import React  from 'react';
import { Link  } from 'react-router-dom'
import Style from './Header.less'
import {inject, observer} from 'mobx-react';
import {withRouter} from "react-router-dom";
import EditProjectModal from './EditProjectModal'
import config  from '@/config';

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
   title: '在线mock地址',
   content: "http://127.0.0.1:3015/project/mock/ + 接口url",
 });
}
handleResetProject=()=>{
  Modal.confirm({
   title: '警告',
   content: "确认重置?",
   onOk:()=> {
     this.props.projectList.delProject(1).then(()=>{
       message.success('重置成功')
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

lang=(localStorage.getItem("lang")||"zh-CN")==="zh-CN"?"English":"中文";


changeLang=()=>{
  localStorage.setItem("lang",this.lang==="中文"?"zh-CN":"en-US");
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
   message.success('导入成功')
   this.props.project.getProjectData(1)
 }
}

  render(){
    return (
      <div className={Style.wrapper}>
        <EditProjectModal  onOk={this.handleUpdateProjectOk} onClose={this.closeEditProjectModal}  visible={this.state.editProjectModalShow} ></EditProjectModal>
        <div className={Style.logo}/>
        <div className={Style.menu}>
          moapi

        </div>
        <div className={Style.right} >
          <a onClick={this.openEditProjectModal}><Icon type="setting" />设置</a>
          <a onClick={this.handleResetProject}><Icon type="sync" />重置</a>

          <Upload
            showUploadList={false}
            onChange={this.handleChange}
            action={`${config.baseURL}project/import`}
            >
             <a ><Icon type="login" />导入</a>
           </Upload>
          <a download href={`${config.baseURL}project/export/`}><Icon type="logout" />导出</a>
          <a download href={`${config.baseURL}project/md/`}><Icon type="file-markdown" />生成markdown</a>
          <a target="_blank" href={`${config.baseURL}project/doc/`}><Icon type="file-text" />生成文档</a>
          <a download href={`${config.baseURL}project/server/`}><Icon type="cloud-o" />生成server</a>
          <a onClick={this.handleShowMockUrl}><Icon type="link" />mock地址</a>
        </div>

      </div>

    )
  }
}



export default withRouter(Header)
