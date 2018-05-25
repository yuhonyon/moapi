import React  from 'react';
import {Icon,Select,Modal} from 'antd';
import EditProjectModal from './EditProjectModal'
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
    templateModalShow:false
  }

  openEditProjectModal=()=>{
    this.setState({editProjectModalShow:true})
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
    this.props.project.updateProject(this.props.project.projectId,info)
  }
  handleUpdateTemplateOk=(info)=>{
    this.props.project.updateProject(this.props.project.projectId,{template:info})
  }

  handleShowMockUrl=()=>{
    Modal.info({
     title: '在线mock地址',
     content: this.props.project.mockUrl+" + 接口url",
   });
  }

  render(){
    return(
      <div className={Style.wrapper}>
        <EditProjectModal  onOk={this.handleUpdateProjectOk} onClose={this.closeEditProjectModal}  visible={this.state.editProjectModalShow} ></EditProjectModal>
        <TemplateModal onOk={this.handleUpdateTemplateOk} onClose={this.closeTemplateModal}  visible={this.state.templateModalShow}></TemplateModal>
        <div  className={Style.title}>
          <h1><Link to="/project">{this.props.project.info.admin.name}</Link><span>/</span>{this.props.project.info.name}</h1>
          {/* <Select defaultValue="">
            <Option value="">所有版本</Option>
            <Option value="1.7">版本1.7</Option>
          </Select> */}
        </div>


        <div className={Style.operation}>
          {this.props.project.permission>1&&<a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />编辑</a>}

          {this.props.project.permission>2&&<a onClick={this.openTemplateModal} href="###"><Icon type="edit" />模板</a>}


          <a download href={this.props.project.mdDownloadUrl}><Icon type="edit" />下载Markdown</a>

          <a target="_blank" href={this.props.project.docUrl}><Icon type="edit" />接口文档</a>

          <a download  href={this.props.project.serverUrl}><Icon type="edit" />生成server</a>

          <a target="_blank" href={this.props.interfases.testUrl}><Icon type="edit" />接口测试</a>

          <a href="javascript:void(0);" onClick={this.handleShowMockUrl}><Icon type="edit" />在线mock地址</a>
        </div>

        {/* <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />导出</a>


        <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />导入</a> */}
      </div>
    )
  }
}



export default Header
