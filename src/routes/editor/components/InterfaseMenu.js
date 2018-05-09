
import React from 'react';
import { Menu } from 'antd';
import { Link  } from 'react-router-dom'
import Style from './InterfaseMenu.less'
import {inject, observer} from 'mobx-react';

@inject("project")
@observer
export default class InterfaseMenu extends React.Component {
  state = {
    selectedKey:this.props.project.moduleId+''
  }

  handleClick = (e) => {
    this.setState({'selectedKey':e.key});
    let interfaseInfo=e.item.props.interfase;
    this.props.project.selectInterfase(interfaseInfo.moduleId,interfaseInfo.id)
  }
  render() {
    return (
      <Menu className={Style.menu}
        onClick={this.handleClick}
        style={{ width: 200 }}
        selectedKeys={[this.selectedKey]}
        mode="inline"
      >
        {
          this.props.project.interfases.map(item=>{
            return (
              <Menu.Item key={item.id} interfase={item}>
                  <Link to={{
                              pathname: '/editor/2',
                              search: `?moduleId=${item.moduleId}&interfaseId=${item.id}`
                            }}>{item.name}</Link>
              </Menu.Item>
            )
          })
        }


      </Menu>
    );
  }
}
