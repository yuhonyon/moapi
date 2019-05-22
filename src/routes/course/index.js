import React from "react";
import ReactMarkdown from 'react-markdown'
import style from './course.less'

class Course extends React.Component {
  md=`

# 图文教程

## 新建项目
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38pb5a4psj20x70mm40o.jpg)

## 修改项目信息

![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38pfl5hrxj20x00n50ve.jpg)

## 添加模块&接口
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38pikd9nej20xf0geabu.jpg)





## 编辑接口
### 界面
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38qp54vxnj20xl0q70x1.jpg)

### 添加path参数,修改url即可
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g39wamxb72j20xx0l2wgw.jpg)

### 新建字段
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38wwgc2wvj20sg0lr40p.jpg)

### 修改记录(可还原查看,编辑状态还原后可以保存)
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g39wcvukxzj20sq0dzmyj.jpg)

### 导入json
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38qxh8t8yj20tb0o8mzg.jpg)
数组格式没有key 会自动套一个key"array_type_data"来展示 最终使用会去掉
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38r1m8cu7j20qz0b3myg.jpg)
### 导入模板
操作同导入json 数据类型为平台储存接口数据的格式
\`\`\`json
[
  {
    "name": "page",
    "type": "Number",
    "required": true,
    "mockType": "Number",
    "mockNum": "1-20",
    "mockValue": 1,
    "description": "分页"
  },
  {
    "name": "pageSize",
    "type": "Number",
    "required": true,
    "mockType": "Number",
    "mockNum": "",
    "mockValue": 20,
    "description": "每页数量"
  }
]
\`\`\`


## 导入Swagger
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38q5n5yhmj20wx0b8myx.jpg)

## 同步Swagger入口
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38qhs5li1j20xj0cjq5k.jpg)


## mock规则
> mockJS文档[http://mockjs.com/examples.html]
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38rgudejdj21210pxael.jpg)


## 开启mock
> 开启mock后走假数据,关闭则代理到真实接口
### 全局开启/关闭
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38s5fftewj20qg0jc40p.jpg)
### 单个接口开启/关闭
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38s66c62pj20nz08ggmq.jpg)
### 开启mock的接口会有小绿点标识
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38v2lvsfrj20pe05qq3v.jpg)



## 拖拽
* 接口列表可拖拽
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38rl8qxq4j212z06nwft.jpg)
* 接口字段顺序可拖拽排序(仅限同级,跨级请用复制模板导入模板功能修改)
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38rsnc3usj20f408xjs6.jpg)
* 附件目录
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38rulfxaoj20n50avmyb.jpg)


## 接口测试(在线版postman,优点:自动填充参数)
### 入口
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38s1otultj20o908jt9u.jpg)
### 界面
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38s34aclmj20y20fjq56.jpg)
### 鉴权
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38skcn81fj20wl0dkjt5.jpg)


## 版本标识
* 目前版本控制只有标记和筛选功能
* 默认版本V1.0.0 
添加版本入口
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38v5naru2j20v60ayta4.jpg)
接口添加版本标识入口
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38v68i55aj20wv0bx75u.jpg)
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38v6t1y9lj20um0drta7.jpg)

## 版本号应用
* 标识接口版本
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38v98nq97j20la06lt9g.jpg)
* 标识备注对应版本
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38v8nhj1fj20tj0c3q45.jpg)
* 筛选当前版本接口(比如项目有100个接口,2.0版本只修改了10个接口,筛选后只展示这10个)
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38vbrvlu4j20xy083abg.jpg)


## 附件管理
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38vfcxfk2j20qq0kkdib.jpg)
* 支持markdown文档增删改
* 拖拽目录结构
* exec,word,ppt,img文件预览
* 静态网站打包上传并可预览(比如marketch导出标注)
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38virxw83j20y1099wfo.jpg)




### 设置网关格式
* 点击编辑网关格式,按下方格式编辑
* 接口返回数据用"$data"表示,无则默认接口返回数据合并网关格式设置的数据
\`\`\`json
{
  "headers": {
    "token": "sadfasdfasdfasdfsadf"
  },
  "res": {
    "result": "$data",
    "ok": true,
    "code": 200
  },
  "req": {}
}
\`\`\`
效果
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38src4589j20rh0crmyw.jpg)


## 在线文档
入口
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38su8u2rej20rh078jsg.jpg)
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38suvdtpdj20ni07pjs5.jpg)
界面说明
![](http://ww1.sinaimg.cn/large/82eaf5a8ly1g38staaaw6j20yq0n4tbg.jpg)




## 旧文档

### 鉴权
* headers key 方式
* 账号密码方式

### 设置网关格式
* 点击编辑网关格式,按下方格式编辑
* 接口返回数据用"$data"表示,无则默认接口返回数据合并网关格式设置的数据
* 项目编辑里打开网关模式会应用网关格式数据
\`\`\`json
{
    "headers": {
        "token": 111111,
    },
    "req": {
        "token": 20001
    },
    "res": {
        "rerult": "$data",
        "code": 2000,
        "msg": "请求成功"
    }
}
\`\`\`

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
* 项目详情里 点击接口url进入
* 在线文档里 点击接口url进入




### 获取接口文档:
* 在线地址:[http://moapi.yfyld.top/project/doc/:projectId]
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
* 接口详情最下面有添加备注入口,默认版本为最新版本

### mockJS
* mockJS文档[http://mockjs.com/examples.html]


### 设置接口模板:
* 点击编辑模板,按下方格式编辑模板,key为随意字符串,模板内唯一即可
* header 格式
\`\`\`json
{
  "name": "token",
  "key": 1,
  "description": "描述",
  "value": "asdgasd-asdf-asdfasdf-asdfasdf"
}
\`\`\`
* request 格式
\`\`\`json
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
\`\`\`
* response 格式
\`\`\`json
{
  "key": "3",
  "name": "data",
  "type": "Object",
  "mockType": "Object",
  "mockNum": "",
  "mockValue": "",
  "description": "返回数据"
}
\`\`\`


### 获取mock server方法:
* 在线地址:[http://moapi.yfyld.top/project/mock/:projectId+接口url]
* 本地:生成server,npm i&&npm start

  `
  render(){
    return (<div className={style.wrapper}><ReactMarkdown source={this.md} /></div>)
  }
}

export default Course
