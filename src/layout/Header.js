import { Menu} from 'antd';
import React  from 'react';
import { Link  } from 'react-router-dom'

function Header(){
  return (
    <div>
      <div className="logo"/>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} style={{
          lineHeight: '64px'
        }}>
        <Menu.Item key="1"><Link to="/project" >首页</Link></Menu.Item>
        <Menu.Item key="2"><Link to="/editor/project1" >仓库</Link></Menu.Item>
        <Menu.Item key="3"><Link to="/project1" >教程</Link></Menu.Item>
      </Menu>
    </div>
  )
}

export default Header
