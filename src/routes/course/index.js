import React from "react";

class Course extends React.Component {

  render(){
    return (
      <div >
        <h3>角色权限:</h3>
        <ul>
          <li>管理者:所有权限</li>
          <li>开发者:除删除项目和修改项目成员外所有权限</li>
          <li>使用者:只能修改mock数据</li>
          <li>游客:只能看</li>
        </ul>

        <h3>项目分类:</h3>
        <ul>
          <li>我的项目:项目管理员为自己的项目</li>
          <li>参与项目:项目开发者含有自己的项目</li>
          <li>相关项目:项目使用者含有自己的项目</li>
          <li>所有项目:前三者加上开放的项目</li>
        </ul>

        <h3>mock方式:</h3>
        <ul>
          <li>关闭:直接转发代理地址</li>
          <li>开启:返回mock数据</li>
          <li>合并:先转发代理地址得到数据后,合并mock数据返回</li>
        </ul>


        <h3>获取mock server方法:</h3>
        <ul>
          <li>在线地址:http://moapi.yfyld.top/project/mock/:projectId+接口url</li>
          <li>本地:生成server,npm i&&npm start</li>
        </ul>

        <h3>获取接口文档:</h3>
        <ul>
          <li>在线地址:http://moapi.yfyld.top/project/doc/:projectId</li>
          <li>markdown:下载markdown</li>
        </ul>

        <h3>设置接口模板:</h3>
        <ul>
          <li>
            点击编辑模板,按下方格式编辑模板,key为随意字符串,模板内唯一即可
          </li>
          <li>
            header 格式
            <pre>
              {
`{
  "name": "token",
  "key": 1,
  "description": "描述",
  "value": "asdgasd-asdf-asdfasdf-asdfasdf"
}`
              }
            </pre>
          </li>
          <li>
            request 格式
            <pre>
              {
`{
  "key": "2",
  "name": "id",
  "type": "Number",
  "required":true,
  "mockType": "Number",
  "mockNum": "",
  "mockValue": "",
  "description": "请求数据"
}`
              }
            </pre>
          </li>
          <li>
            response 格式
            <pre>
              {
`{
  "key": "3",
  "name": "data",
  "type": "Object",
  "mockType": "Object",
  "mockNum": "",
  "mockValue": "",
  "description": "返回数据"
}`
              }
            </pre>
          </li>
        </ul>

      </div>
    )
  }
}

export default Course
