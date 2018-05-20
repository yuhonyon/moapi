import React  from 'react';
import {Icon,Select} from 'antd';
import EditProjectModal from './EditProjectModal'
import {inject, observer} from 'mobx-react';
import Style from "./Header.less"

const Option =Select.Option;


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
  handleUpdateProjectOk=(info)=>{
    this.props.project.updateProject(this.props.project.projectId,info)
  }

  render(){
    return(
      <div className={Style.wrapper}>
        <EditProjectModal  onOk={this.handleUpdateProjectOk} onClose={this.closeEditProjectModal}  visible={this.state.editProjectModalShow} ></EditProjectModal>
        <div  className={Style.title}>
          <h1>{this.props.project.info.name}</h1>
          {/* <Select defaultValue="">
            <Option value="">所有版本</Option>
            <Option value="1.7">版本1.7</Option>
          </Select> */}
        </div>


        <div className={Style.operation}>
          {this.props.project.permission>1&&<a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />编辑</a>}


          <a download href={this.props.project.mdDownloadUrl}><Icon type="edit" />下载Markdown</a>

          <a target="_blank" href={this.props.project.docUrl}><Icon type="edit" />接口文档</a>

          <a download  href={this.props.project.serverUrl}><Icon type="edit" />生成server</a>

          <a target="_blank" href={this.props.project.mockUrl}><Icon type="edit" />在线mock地址</a>
        </div>

        {/* <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />导出</a>


        <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />导入</a> */}
      </div>
    )
  }
}



export default Header
