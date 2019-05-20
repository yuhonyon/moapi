import React from "react";
import Style from './AccountLayout.less'
import logo from "@/assets/imgs/logo_bg.png"
// import intl from "react-intl-universal";



const lang=(localStorage.getItem("lang")||"zh-CN")==="zh-CN"?"English":"中文";


function changeLang(){
  localStorage.setItem("lang",lang==="中文"?"zh-CN":"en-US");
  window.location.reload();
}
function AccountLayout(props){
  return (
    // <div className={Style.wrapper}>
    //   <div className={Style.header}>
    //     <div className={Style.headerLogo}>
    //       moapi
    //     </div>
    //     <div className={Style.headerMenu}>
    //       <a href="###" onClick={changeLang}>{lang}</a>
    //     </div>
    //   </div>
    //   <div className={Style.content}>
    //     <div className={Style.main}>
    //       <Tabs type="card">
    //         <TabPane tab={intl.get("login.signin").d("登录")} key="signin">
    //           <LoginForm></LoginForm>
    //         </TabPane>
    //         <TabPane tab={intl.get("login.signup").d("注册")} key="signup">
    //           <SignupForm></SignupForm>
    //         </TabPane>
    //       </Tabs>
    //     </div>
    //   </div>
    //   <div  className={Style.footer}>footer</div>
    // </div>
    <div className={Style.wrapper}>
        <div className={Style.header}>
          <div className={Style.logo}>
           <img src={logo} alt=""/>
          </div>
          <div className={Style.menu}>
            <a href="###" onClick={changeLang}>{lang}</a>
          </div>
        </div>
        <div className={Style.content}>
          <div className={Style.box}>
            <div className={Style.form}>
            {props.children}
            </div>
          </div>
        </div>
        <div className={Style.footer} />
      </div>
  )
}

export default AccountLayout;
