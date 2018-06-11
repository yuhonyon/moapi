
import React from 'react';
import { Menu,Icon,message,Button,Modal } from 'antd';
import Style from './InterfaseMenu.less'
import {inject, observer} from 'mobx-react';
import AddInterfaseModal from './AddInterfaseModal';
import EditInterfaseModal from './EditInterfaseModal';
import {toJS} from 'mobx';
import {withRouter} from "react-router-dom";
import intl from "react-intl-universal";


@inject("project")
@observer
class InterfaseMenu extends React.Component {
  state = {
    selectedKey:this.props.project.interfaseId+'',
    addInterfaseModalShow:false,
    editInterfaseModalShow:false,
    editInterfaseInfo:{}
  }

  componentWillReceiveProps(){
    this.setState({'selectedKey':this.props.project.interfaseId+''});
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
      message.success(intl.get('project.interfase.success'))
    });;
  }

  handleEditInterfaseModalOk=(info)=>{
    info={...this.state.editInterfaseInfo,...info};
    this.props.project.updateInterfase(info.id,info).then(()=>{
      message.success(intl.get('project.interfase.editSuccess'))
    });
  }




  handleMenuClick = (e) => {
    this.setState({'selectedKey':e.key});
    let interfaseInfo=e.item.props.interfase;
    this.props.project.selectInterfase(interfaseInfo.moduleId,interfaseInfo.id);

    this.props.history.push({
                pathname: `/`,
                search: `?moduleId=${e.item.props.interfase.moduleId}&interfaseId=${e.item.props.interfase.id}`
              })
  }

  handleInterfaseEdit=(interfase,e)=>{
    e.stopPropagation();
    this.openEditInterfaseModal(toJS(interfase))
  }

  handleInterfaseDelete=(interfaseId,e)=>{
    e.stopPropagation();

    Modal.confirm({
      title: intl.get('project.interfase.delete.title'),
      content: intl.get('project.interfase.delete.content'),
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
          selectedKeys={[this.state.selectedKey]}
          mode="inline"
        >
          {
            this.props.project.inVersionInterfases.map(item=>{
              return (
                <Menu.Item key={item.id} interfase={item}>
                    {item.name}&emsp;
                    {this.props.project.permission>2&&<span className={Style.icon}>
                        <Icon interfase={item} onClick={this.handleInterfaseEdit.bind(this,item)}  type="form" />
                        <Icon interfase={item} onClick={this.handleInterfaseDelete.bind(this,item.id)}  type="delete" />
                      </span>}
                </Menu.Item>
              )
            })
          }


        </Menu>
        {this.props.project.permission>2&&<Button onClick={this.openAddInterfaseModal} className={Style.addBtn}><Icon type="plus-circle-o" />{intl.get('project.interfase.btn')}</Button>}
      </div>
    );
  }
}

export default withRouter(InterfaseMenu)
