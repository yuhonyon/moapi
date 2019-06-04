import React from "react";
import ReactMarkdown from 'react-markdown'


class About extends React.Component {
  md=`
## 开发人员
  * 刘灯 如遇bug或有功能需求 请钉钉联系我(15555555555)


## Tech Arch
  * 前端架构
    - React16+Router4+Mobx+Webpack
    - Mock.js+best-marked
    - Less+Antd+ModuleCss
  * 后端架构
    - Koa2
    - Mongoose
  * 技术参考
    - 样式交互参考\`rap2\`
    - 功能参考\`atmo\` 、 \`swagger\` 、 \`easy mock\` 

## 特性
  * 支持接口代理
  * 支持生成接口文档
  * 支持生成接口markdown文档
  * 支持接口模板设置
  * 支持管理员,开发者,使用者,游客等多种账号权限
  * 支持修改记录
  * 支持版本帅选
  * 支持备注记录
  * 支持项目关注
  * 支持markdown文档管理,在线编辑
  * 支持生成mock server代码
  * 支持灵活编辑mock数据
  * 支持mockjs语法
  * 支持restc方式测试接口
  * 同步swagger
  * 生成CURL
  * 接口历史回滚
  `
  render(){
    return <ReactMarkdown source={this.md} />
  }
}

export default About
