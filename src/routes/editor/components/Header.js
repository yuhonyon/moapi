import React  from 'react';
import {Icon} from 'antd';
import EditProjectModal from './EditProjectModal'

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
        项目名称&emsp;
        <a onClick={this.openEditProjectModal} href="###"><Icon type="edit" />编辑</a>
        <EditProjectModal onClose={this.closeEditProjectModal} title="导入属性" visible={this.state.editProjectModalShow} ></EditProjectModal>
      </div>
    )
  }
}



export default Header
