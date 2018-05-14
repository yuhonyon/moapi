import React  from 'react';
import {Icon} from 'antd';
import EditProjectModal from './EditProjectModal'
import {inject, observer} from 'mobx-react';




@inject("project")
@observer
class Header extends React.Component {
  state={
    editProjectModalShow:false
  }

  openEditProjectModal=()=>{
    this.setState({editProjectModalShow:true})
  }
  closeEditProjectModal=()=>{
    this.setState({editProjectModalShow:false})
  }

  render(){
    return(
      <div>
        <EditProjectModal onClose={this.closeEditProjectModal}  visible={this.state.editProjectModalShow} ></EditProjectModal>
        项目名称&emsp;
        <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />编辑</a>


        <a download href={this.props.project.mdDownloadUrl}><Icon type="edit" />下载Markdown</a>

        <a target="_blank" href={this.props.project.docUrl}><Icon type="edit" />接口文档</a>

        <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />导出</a>


        <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />导入</a>


        <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />生成server</a>
      </div>
    )
  }
}



export default Header
