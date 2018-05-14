
import React from 'react';
import { Menu,Icon,message,Button,Modal } from 'antd';
import { Link  } from 'react-router-dom'
import Style from './InterfaseMenu.less'
import {inject, observer} from 'mobx-react';
import AddInterfaseModal from './AddInterfaseModal';
import EditInterfaseModal from './EditInterfaseModal';
import {toJS} from 'mobx';



@inject("project")
@observer
export default class InterfaseMenu extends React.Component {
  state = {
    selectedKey:this.props.project.moduleId+'',
    addInterfaseModalShow:false,
    editInterfaseModalShow:false,
    editInterfaseInfo:{}
  }

  openAddInterfaseModal=()=>{
    this.setState({addInterfaseModalShow:true})
  }
  closeAddInterfaseModal=()=>{
    this.setState({addInterfaseModalShow:false})
  }


  openEditInterfaseModal=(interfase)=>{
    this.setState({editInterfaseModalShow:true,editInterfaseInfo:interfase})
  }
  closeEditInterfaseModal=()=>{
    this.setState({editInterfaseModalShow:false})
  }




  handleAddInterfaseModalOk=(info)=>{
    info.moduleId=this.props.project.moduleId;
    info.projectId=this.props.project.data.id;
    this.props.project.addInterfase(info).then(()=>{
      message.success('添加成功')
    });;
  }

  handleEditInterfaseModalOk=(info)=>{
    info={...this.state.editInterfaseInfo,...info};
    this.props.project.updateInterfase(info.id,info).then(()=>{
      message.success('编辑成功')
    });
  }




  handleMenuClick = (e) => {
    this.setState({'selectedKey':e.key});
    let interfaseInfo=e.item.props.interfase;
    this.props.project.selectInterfase(interfaseInfo.moduleId,interfaseInfo.id)
  }

  handleInterfaseEdit=(interfase,e)=>{
    e.preventDefault();
    this.openEditInterfaseModal(toJS(interfase))
  }

  handleInterfaseDelete=(interfaseId,e)=>{
    e.preventDefault();

    Modal.confirm({
      title: '删除提醒',
      content: '确认要删除接口?',
      onOk:()=>{
        this.props.project.deleteInterfase(interfaseId)
      }
    });
  }


  render() {
    return (
      <div className={Style.wrapper}>
        <AddInterfaseModal  onClose={this.closeAddInterfaseModal} onOk={this.handleAddInterfaseModalOk} visible={this.state.addInterfaseModalShow}></AddInterfaseModal>
        <EditInterfaseModal interfase={this.state.editInterfaseInfo}  onClose={this.closeEditInterfaseModal} onOk={this.handleEditInterfaseModalOk} visible={this.state.editInterfaseModalShow}></EditInterfaseModal>
        <Menu className={Style.menu}
          onClick={this.handleMenuClick}
          style={{ width: 200 }}
          selectedKeys={[this.selectedKey]}
          mode="inline"
        >
          {
            this.props.project.interfases.map(item=>{
              return (
                <Menu.Item key={item.id} interfase={item}>
                    <Link to={{
                                pathname: `/editor/${this.props.project.data.id}`,
                                search: `?moduleId=${item.moduleId}&interfaseId=${item.id}`
                              }}>{item.name}<Button interfase={item} onClick={this.handleInterfaseEdit.bind(this,item)} shape="circle" icon="form" /><Button interfase={item} onClick={this.handleInterfaseDelete.bind(this,item.id)} shape="circle" icon="delete" /> </Link>
                </Menu.Item>
              )
            })
          }


        </Menu>
        <button onClick={this.openAddInterfaseModal} className={Style.addBtn}><Icon type="plus-circle-o" />新增接口</button>
      </div>
    );
  }
}
