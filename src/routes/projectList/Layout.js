import React from "react";
import { Tabs,Button,message,Modal } from 'antd';
import Style from "./Layout.less";
import {inject, observer} from 'mobx-react';
import Pane from "./components/Pane"
import AddProjectModal from "./components/AddProjectModal"
import EditProjectModal from "./../project/components/EditProjectModal"
const TabPane=Tabs.TabPane;

@inject("projectList","project")
@observer
class Layout extends React.Component {
  state={
    addProjectModalShow:false,
    editProjectModalShow:false,
    tabsKey:"self"
  }
  componentDidMount(){
    this.fetchProjectList()
  }
  openEditProjectModal=(projectId)=>{
    this.props.project.getProjectInfo(projectId).then(()=>{
      this.setState({editProjectModalShow:true})
    })

  }
  handleUpdateProjectOk=(info)=>{
    this.props.project.updateProject(this.props.project.info.id,info).then(()=>{
      this.fetchProjectList()
    })
  }
  closeEditProjectModal=()=>{
    this.setState({editProjectModalShow:false})
  }
  handleChange=(key)=>{
    this.setState({"tabsKey":key},()=>{
      this.fetchProjectList()
    });
  }

  fetchProjectList(){
    if(this.state.tabsKey==="self"){
      this.props.projectList.getSelfProjectList()
    }else if(this.state.tabsKey==="relate"){
      this.props.projectList.getRelateProjectList()
    }else if(this.state.tabsKey==="all"){
      this.props.projectList.getProjectList()
    }else if(this.state.tabsKey==="develop"){
      this.props.projectList.getDevelopProjectList()
    }
  }

  handleAddProject=()=>{
    this.setState({addProjectModalShow:true})
  }

  handleAddProjectOk=(info)=>{
    this.props.projectList.addProject(info).then(()=>{
      message.success("添加成功");
      this.props.projectList.getSelfProjectList()
    })
  }
  handleAddProjectClose=()=>{
    this.setState({addProjectModalShow:false})
  }
  handleShowMockUrl=()=>{
    Modal.info({
     title: '在线mock地址',
     content: this.props.project.mockUrl+" + 接口url",
   });
  }
  handleDeleteProject=(projectId)=>{
    Modal.confirm({
    title: '警告',
    content: '确认要删除项目吗',
    onOk:()=> {
      this.props.projectList.delProject(projectId).then(()=>{
        message.success('删除成功')
        this.props.projectList.getSelfProjectList()
      })
    },
  });
  }

  render(){
    return (
      <div >
        <EditProjectModal  onOk={this.handleUpdateProjectOk} onClose={this.closeEditProjectModal}  visible={this.state.editProjectModalShow} ></EditProjectModal>
        <AddProjectModal  onOk={this.handleAddProjectOk} onClose={this.handleAddProjectClose}  visible={this.state.addProjectModalShow}></AddProjectModal>
        <Tabs activeKey={this.state.tabsKey} onChange={this.handleChange} tabBarExtraContent={<Button onClick={this.handleAddProject}>添加项目</Button>}>
          <TabPane tab="我的项目" key="self">
            {this.props.projectList.self.map(project=>(
              <Pane onMockUrl={this.handleShowMockUrl} onDelete={this.handleDeleteProject} onUpdate={this.openEditProjectModal} self editable key={project.id} project={project}></Pane>
            ))}
            {this.props.projectList.self.length===0&&<div className={Style.noDataNote}>暂无项目</div>}
          </TabPane>
          <TabPane tab="参与项目" key="develop">
            {this.props.projectList.develop.map(project=>(
              <Pane onMockUrl={this.handleShowMockUrl} onUpdate={this.openEditProjectModal} editable key={project.id} project={project}></Pane>
            ))}
            {this.props.projectList.develop.length===0&&<div className={Style.noDataNote}>暂无项目</div>}
          </TabPane>
          <TabPane tab="相关项目" key="relate">
            {this.props.projectList.relate.map(project=>(
              <Pane onMockUrl={this.handleShowMockUrl} key={project.id} project={project}></Pane>
            ))}
            {this.props.projectList.relate.length===0&&<div className={Style.noDataNote}>暂无项目</div>}
          </TabPane>
          <TabPane tab="所有项目" key="all">
            {this.props.projectList.all.map(project=>(
              <Pane onMockUrl={this.handleShowMockUrl} key={project.id} project={project}></Pane>
            ))}
            {this.props.projectList.all.length===0&&<div className={Style.noDataNote}>暂无项目</div>}
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Layout
