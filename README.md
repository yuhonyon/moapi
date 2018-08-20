# moapi
mock平台 [moapi在线平台](http://moapi.yfyld.online)

----
## Tech Arch
* 前端架构
  - React16+Router4+Mobx+Webpack
  - Mock.js+best-marked
  - Less+Antd+ModuleCss
  - Nginx
* 后端架构
  - Koa2
  - MongoDB
  - Mongoose
* 自动部署
  - jenkins

## 介绍
* 团队使用推荐;
* 没用内网部署条件推荐使用[moapi在线平台](http://moapi.yfyld.online)或本地mock工具[moapi-cli](https://www.npmjs.com/package/moapi-cli);
* 有条件内网部署更安全,部署方法[README](http://moapi.yfyld.online)(正在写...);

### 特性
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

### 链接
* [moapi-cli](https://www.npmjs.com/package/moapi-cli);
* [mock服务端](https://github.com/yuhonyon/moapi-server)

## 使用方法

### 角色权限
* 管理者:所有权限
* 开发者:除删除项目和修改项目成员外所有权限
* 使用者:只能修改mock数据
* 游客:只能看

### 项目分类:
* 我的项目:项目管理员为自己的项目
* 参与项目:项目开发者含有自己的项目
* 相关项目:项目使用者含有自己的项目
* 所有项目:前三者加上开放的项目


### mock方式:
* 关闭:直接转发代理地址
* 开启:返回mock数据
* 合并:先转发代理地址得到数据后,合并mock数据返回

### 测试接口:
* 项目详情里 点击"测试接口"或者接口url
* 在线文档里 点击接口url
* 需要测试真实接口 要先关闭mock,即转发真实接口地址

### 获取mock server方法:
* 在线地址:[http://moapi.yfyld.online/project/mock/:projectId+接口url]
* 本地:生成server,npm i&&npm start

### 获取接口文档:
* 在线地址:[http://moapi.yfyld.online/project/doc/:projectId]
* markdown:下载markdown

### 其他文档管理
* 其他文档列表 项目列表中及项目详情"markdown文档"中点击文档名称跳转
* 添加 项目详情"markdown文档"中上传
* 编辑 项目列表中及项目详情"markdown文档"中点击编辑按钮


### 版本标记
* 功能 目前版本控制只有标记和筛选功能
* 添加版本 默认版本V1.0.0  项目详情有添加版本入口,添加后新增接口默认标记当前版本
* 添加接口版本标记 编辑接口版本列表中会有添加入口,可通过筛选版本只显示当前版本相关的接口

### 项目修改记录
* 首页可添加关注项目,即可获取项目的修改记录
* 项目详情内每个接口都有对应的修改记录查看入口

### 添加备注
# 接口详情最下面有添加备注入口,默认版本为最新版本

### mockJS
* mockJS文档[http://mockjs.com/examples.html]

### 设置接口模板:
* 点击编辑模板,按下方格式编辑模板,key为随意字符串,模板内唯一即可
* header 格式
```json
{
  "name": "token",
  "key": 1,
  "description": "描述",
  "value": "asdgasd-asdf-asdfasdf-asdfasdf"
}
```
* request 格式
```json
{
  "key": "2",
  "name": "id",
  "type": "Number",
  "required":true,
  "mockType": "Number",
  "mockNum": "",
  "mockValue": "",
  "description": "请求数据"
}
```
* response 格式
```json
{
  "key": "3",
  "name": "data",
  "type": "Object",
  "mockType": "Object",
  "mockNum": "",
  "mockValue": "",
  "description": "返回数据"
}
```
