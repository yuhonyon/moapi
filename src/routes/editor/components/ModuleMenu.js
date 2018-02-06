import { Menu } from 'antd';
import React from 'react';
import { Link  } from 'react-router-dom'
export default class MoudleMenu extends React.Component {
  state = {
    current: 'mail'
  }
  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key

    });
  }
  render() {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
      >
        <Menu.Item key="mail">
            <Link to={this.props.rootPath+'/1'}>全局</Link>
        </Menu.Item>
        <Menu.Item key="mail2">
            <Link to={this.props.rootPath+'/2'}>数据统计</Link>
        </Menu.Item>
        <Menu.Item key="mail3">
            <Link to={this.props.rootPath+'/3'}>系统管理</Link>
        </Menu.Item>

      </Menu>
    );
  }
}
