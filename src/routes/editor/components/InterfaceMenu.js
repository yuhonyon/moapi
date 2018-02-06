
import React from 'react';
import { Menu } from 'antd';
import { Link  } from 'react-router-dom'
export default class InterfaceMenu extends React.Component {
  state = {

  }
  handleClick = (e) => {
    console.log('click ', e);
  }
  render() {
    return (
      <Menu
        onClick={this.handleClick}
        style={{ width: 200 }}
        defaultSelectedKeys={['1']}
        mode="inline"
      >
        <Menu.Item key="9"><Link to={this.props.rootPath+'/1'}>接口1</Link></Menu.Item>
        <Menu.Item key="10"><Link to={this.props.rootPath+'/2'}>接口1</Link></Menu.Item>
        <Menu.Item key="11"><Link to={this.props.rootPath+'/3'}>接口1</Link></Menu.Item>
        <Menu.Item key="12"><Link to={this.props.rootPath+'/4'}>接口1</Link></Menu.Item>
      </Menu>
    );
  }
}
