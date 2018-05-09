import React from "react";
import LoginForm from "./LoginForm";
import Style from './Login.less'

function Login(props){
  return (
    <div className={Style.wrapper}>
      <div className={Style.header}>header</div>
      <div className={Style.content}>
        <div className={Style.main}>
          <LoginForm></LoginForm>
        </div>
      </div>
      <div className={Style.footer}>footer</div>
    </div>
  )
}

export default Login;
