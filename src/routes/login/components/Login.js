import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Style from './Login.less'
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane;

function Login(props){
  return (
    <div className={Style.wrapper}>
      <div className={Style.header}>moapi</div>
      <div className={Style.content}>
        <div className={Style.main}>
          <Tabs type="card">
            <TabPane tab="登录" key="signin">
              <LoginForm></LoginForm>
            </TabPane>
            <TabPane tab="注册" key="signup">
              <SignupForm></SignupForm>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <div className={Style.footer}>footer</div>
    </div>
  )
}

export default Login;
