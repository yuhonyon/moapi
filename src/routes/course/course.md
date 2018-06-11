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
* 需要测试真实接口 要先关闭mock

### 获取mock server方法:
* 在线地址:http://moapi.yfyld.top/project/mock/:projectId+接口url
* 本地:生成server,npm i&&npm start

### 获取接口文档:
* 在线地址:http://moapi.yfyld.top/project/doc/:projectId
* markdown:下载markdown

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
