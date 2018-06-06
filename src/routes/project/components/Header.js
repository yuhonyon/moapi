import React  from 'react';
import {Icon,Select,Modal,Button,Input} from 'antd';
import EditProjectModal from './EditProjectModal'
import EditDocModal from './EditDocModal'
import TemplateModal from './TemplateModal'
import {inject, observer} from 'mobx-react';
import Style from "./Header.less"
import { Link  } from 'react-router-dom'

const Option =Select.Option;


@inject("project","interfases")
@observer
class Header extends React.Component {
  state={
    editProjectModalShow:false,
    templateModalShow:false,
    editDocModalShow:false
  }
  addVersion=""

  openEditProjectModal=()=>{
    this.setState({editProjectModalShow:true})
  }
  openEditDocModal=()=>{
    this.setState({editDocModalShow:true})
  }
  openTemplateModal=()=>{
    this.setState({templateModalShow:true})
  }
  closeTemplateModal=()=>{
    this.setState({templateModalShow:false})
  }
  closeEditProjectModal=()=>{
    this.setState({editProjectModalShow:false})
  }
  handleUpdateProjectOk=(info)=>{
    this.props.project.updateProject(this.props.project.projectId,info).then(()=>{
      this.props.project.getProjectInfo(this.props.project.projectId)
    })
  }
  handleUpdateTemplateOk=(info)=>{
    this.props.project.updateProject(this.props.project.projectId,{template:info}).then(()=>{
      this.props.project.getProjectInfo(this.props.project.projectId)
    })
  }
  handlerAddVersion=()=>{
    this.addVersion="";
    const ref =Modal.confirm({
      title: '添加项目版本号',
      content: (
        <Input defaultValue={this.addVersion} style={{width:200}} onInput={e=>(this.addVersion=e.target.value)}></Input>
      ),
      iconType:"plus-circle",
      okText: '添加',
      cancelText: '取消',
      onOk:()=>{
        ref.destroy();
        if(this.addVersion===""||this.props.project.info.versions.includes(this.addVersion)){
          return;
        }
        this.props.project.addVersion(this.addVersion)
      }
    });
  }
  handleChangeVersion=(value)=>{
    this.props.project.changeCurVersion(value)
  }

  handleShowMockUrl=()=>{
    Modal.info({
     title: '在线mock地址',
     content: this.props.project.mockUrl+" + 接口url",
   });
  }

  handleUpdateDocOk=()=>{

  }

  closeEditDocModal=()=>{
    this.setState({editDocModalShow:false})
  }

  render(){
    return(
      <div className={Style.wrapper}>
        <EditProjectModal  onOk={this.handleUpdateProjectOk} onClose={this.closeEditProjectModal}  visible={this.state.editProjectModalShow} ></EditProjectModal>
        <EditDocModal  onOk={this.handleUpdateDocOk} onClose={this.closeEditDocModal}  visible={this.state.editDocModalShow} ></EditDocModal>
        <TemplateModal onOk={this.handleUpdateTemplateOk} onClose={this.closeTemplateModal}  visible={this.state.templateModalShow}></TemplateModal>



        {/* <div className={Style.operation}>
          {this.props.project.permission>1&&<a onClick={this.openEditProjectModal} href="###"><Icon type="setting" />编辑</a>}

          <a target="_blank" href={this.props.project.docUrl}><Icon type="file-text" />导出</a>
          <a target="_blank" href={this.props.project.docUrl}><Icon type="file-text" />导入</a>
          <a download href={this.props.project.mdDownloadUrl}><Icon type="file-markdown" />下载接口Markdown</a>

          <a target="_blank" href={this.props.project.docUrl}><Icon type="file-text" />接口文档</a>

          <a download  href={this.props.project.serverUrl}><Icon type="cloud-download-o" />生成node server</a>

          <a target="_blank" href={this.props.interfases.testUrl}><Icon type="tool" />接口测试</a>

          <a  onClick={this.handleShowMockUrl}><Icon type="link" />在线mock地址</a>
        </div> */}

      </div>
    )
  }
}



export default Header
