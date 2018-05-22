import React from "react";
import {message,Modal,Button,List,Icon} from 'antd';
import { Link  } from 'react-router-dom'
import Style from "./WatchList.less";
import {inject, observer} from 'mobx-react';
import AddWatchProjectModal from './AddWatchProjectModal'

@inject("home")
@observer
class Layout extends React.Component {
  state={
    addWatchProjectModalShow:false
  }


  handleModalClose=()=>{
    this.setState({addWatchProjectModalShow:false})
  }

  handleAddOk=(info)=>{
    this.props.home.addWatchProject(info).then(()=>{
      message.success('添加成功')
    })
  }

  handleOpenModal=()=>{
    this.setState({addWatchProjectModalShow:true})
  }
  handleDelete=(project)=>{
    this.props.home.deleteWatchProject({projectId:project.id}).then(()=>{
      message.success('取消成功')
    })
  }

  render(){
    return (
      <div>
        <AddWatchProjectModal onOk={this.handleAddOk} onClose={this.handleModalClose}  visible={this.state.addWatchProjectModalShow}></AddWatchProjectModal>
        <List
          bordered
          itemLayout="horizontal"
          dataSource={this.props.home.watchProjectList}
          header={<div className={Style.header}>我关注的项目<Button onClick={this.handleOpenModal} type="primary" size="small">添加关注</Button></div>}
          renderItem={item => (
            <List.Item actions={[<Icon onClick={this.handleDelete.bind(this,item)} type="delete"></Icon>]}>
              <List.Item.Meta
                title={<Link to={`/project/${item.id}`}>{item.name}</Link>}
                description={item.description||"暂无项目简介"}
              />
            </List.Item>
          )}
        />
      </div>
    )
  }
}

export default Layout
