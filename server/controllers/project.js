const ProjectModel =require("../models/project")
const fs = require('fs-extra')
const {getMdData} =require('../util/markedown')
const proxy =require('../util/proxy')
const extend =require('../util/extend')
const send =require("koa-send")
const archiver =require("archiver")
const marked =require("best-marked")
const highlight = require("highlight.js")
const path = require('path')
const ejs =require("ejs")
const parseDate =require("../util/parseDate")

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function(code) {
    return highlight.highlightAuto(code).value;
  },
  pedantic: false,
  gfm: true,
  headerPrefix: "doc-anchor-",
  tocPrefix: "doc-toc-",
  tables: true,
  breaks: true,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
  ordered: true,
  depthFrom: 1,
  depthTo: 2,
  orderStr: [
    [
      "一",
      '二',
      '三',
      '四',
      '五',
      '六',
      '七',
      '八',
      '九',
      '十',
      "十一",
      '十二',
      '十三',
      '十四',
      '十五',
      '十六',
      '十七',
      '十八',
      '十九',
      '二十',
      "二十一",
      '二十二',
      '二十三',
      '二十四',
      '二十五',
      '二十六',
      '二十七',
      '二十八',
      '二十九',
      '三十'
    ]
  ]
});

const markedown = fs.readFileSync(path.join(__dirname, '../views/markdown.ejs')).toString()
const serverTemplate = fs.readFileSync(path.join(__dirname, '../views/server.ejs')).toString()
const packageInfo = `
{
  "name": "mock-server",
  "scripts": {
    "start": "node app.js",
    "dev": "./node_modules/.bin/nodemon app.js"
  },
  "dependencies": {
    "debug": "^2.6.3",
    "ejs": "^2.5.7",
    "koa": "^2.2.0",
    "koa-bodyparser": "^3.2.0",
    "koa-convert": "^1.2.0",
    "koa-cors": "^0.0.16",
    "koa-json": "^2.0.2",
    "koa-logger": "^2.0.1",
    "koa-onerror": "^1.2.1",
    "koa-router": "^7.1.1",
    "koa-static": "^3.0.0",
    "koa-views": "^5.2.1",
    "koa2-pixie-proxy": "^2.0.3"
  },
  "devDependencies": {
    "nodemon": "^1.8.1"
  }
}
`

const intls=[{
  url:"访问URL",
  method:"请求方式",
  description:"简介",
  req:"请求参数",
  reqCode:"请求参数例子",
  res:"响应数据",
  resCode:"响应数据例子",
  name:"字段名",
  type:"数据类型",
  value:"值",
  required:"是否必填",
  description2:"要求及描述",
  link:"管理平台",
  nodata:"无"
},{
  url:"URL",
  method:"method",
  description:"description",
  req:"request",
  reqCode:"request example",
  res:"response",
  resCode:"response example",
  name:"name",
  type:"type",
  value:"value",
  required:"required",
  description2:"Description and requirements",
  link:"The console",
  nodata:"No data"
}]


class Project {
  constructor() {
    this.addProject = this.addProject.bind(this);
  }
  async addProject(ctx, next) {

  }

  async exportProject(ctx, next) {
    let project =await ProjectModel.exportProject();
    ctx.set('Content-disposition', 'attachment;filename=data.json')
    ctx.body = JSON.stringify(project)
  }

  async importProject(ctx, next) {
    let project=await fs.readFile(ctx.req.file.path)
    await ProjectModel.importProject(JSON.parse(project.toString()));
    ctx.body=""
  }



  async deleteProject(ctx, next) {
    await ProjectModel.deleteProject();
    ctx.body = "";
  }

  async updateProject(ctx, next) {
    await ProjectModel.updateProject(ctx.request.body);
    ctx.body = "修改成功";
  }


  async getProject(ctx, next) {
    const project=await ProjectModel.getProject();
    ctx.body = project;
  }

  async getMarkDown(ctx, next){
    let project = await ProjectModel.getProject()
    const mdData = getMdData(project)
    const intl=ctx.query.lang==="en-US"?intls[1]:intls[0];
    const md = ejs.render(markedown, {...mdData,parseDate,intl});
    ctx.set('Content-disposition', 'attachment;filename=doc.md')
    ctx.body = md
  }

  async getDoc(ctx, next) {
    let project = await ProjectModel.getProject()
    const mdData = getMdData(project)
    const intl=ctx.query.lang==="en-US"?intls[1]:intls[0];
    const md = ejs.render(markedown, {...mdData,parseDate,intl});

    await ctx.render("doc", {
      intl,
      title: project.name||"mock项目",
      id: project.id,
      content: marked(md)
    })
  }

  async getDocFile(ctx, next) {
    let project = await ProjectModel.getProject()
    const mdData = getMdData(project)
    const md = ejs.render(markedown, {...mdData,parseDate});

    await ctx.render("doc", {
      title: project.name||"mock项目",
      id: project.id,
      content: marked(md)
    })
  }

  async getServer(ctx, next) {
    let project = await ProjectModel.getProject()

    const mdData = getMdData(project)
    mdData.proxy=mdData.proxy||""
    const server = ejs.render(serverTemplate, mdData);
    const zipName = "server.zip";
    const zipStream = fs.createWriteStream(zipName);
    const zip = archiver('zip');
    zip.pipe(zipStream);

    zip.append(server, {name: 'app.js'});
    zip.append(packageInfo, {name: 'package.js'})

    await zip.finalize();
    ctx.attachment(zipName)
    await send(ctx, zipName);
  }

  async getMock(ctx, next) {
    let project = await ProjectModel.getProject()
    const mdData = getMdData(project)
    let curInterfase;
    let url = ctx.params[0] || "/"

    if (/^\//.test(url)) {
      url = "/" + url
    }

    label : for (let module of mdData.modules) {
      for (let interfase of module.interfases) {
        if (interfase.url.replace(/^\/|\/$/, '') === url.replace(/^\/|\/$/, '') && interfase.method.toUpperCase() === ctx.request.method) {
          curInterfase = interfase;
          break label;
        }
      }
    }

    if (curInterfase && curInterfase.proxyType) {
      if (curInterfase.proxyType === 1) {
        ctx.body = curInterfase.mockRes
      } else {

        let response = await proxy(ctx, next, url, {host: project.proxy})
        if (response) {
          Object.keys(response.headers).forEach(h => ctx.set(h, response.headers[h]));

          ctx.status = response.statusCode;
          try {
            ctx.body = extend(JSON.parse(response.body), JSON.parse(curInterfase.mockRes))
          } catch (e) {

            ctx.body = {
              err: e,
              message: "该接口不能合并mock",
              a: response.body,
              b: curInterfase.mockRes
            }
          }
        } else {
          ctx.body = curInterfase.mockRes;
        }
      }
    } else {
      try {
        let response = await proxy(ctx, next, url, {host: project.proxy})
        if (response) {
          Object.keys(response.headers).forEach(h => ctx.set(h, response.headers[h]));
          ctx.status = response.status;
          ctx.body = response.data;
        }
      } catch (err) {
        Object.keys(err.response.headers).forEach(
            h => ctx.set(h, err.response.headers[h])
        );
        ctx.body = err.response.data;
        ctx.status = err.response.status || 500;
      }

    }

  }

}



module.exports=new Project()
