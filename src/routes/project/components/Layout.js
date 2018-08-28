import React from "react";
import Header from './Header'
import ModuleMenu from './ModuleMenu'
import InterfaseMenu from './InterfaseMenu'
import Interfase from './Interfase'
import Style from './Layout.less'
import {inject, observer} from 'mobx-react';

@inject("project")
@observer
class Editor extends React.Component {
  state={

  }

  componentDidMount(){
    this.props.project.getProjectInfo(this.props.match.params.projectId)
    this.props.project.getProjectData(this.props.match.params.projectId)
  }

  render(){
    return(
      <div className={Style.wrapper}>
        <Header></Header>
        <ModuleMenu
          modules={this.props.project.data.modules} interfaseId={this.props.project.interfaseId}></ModuleMenu>
        {
          this.props.project.inVersionModules.length!==0?<div className={Style.content}>
            <div className={Style.menu}>
              <InterfaseMenu
           moduleId={this.props.project.moduleId}></InterfaseMenu>
            </div>
            <div className={Style.main}>
              {this.props.project.inVersionInterfases.length!==0?<Interfase></Interfase>:`该模块下暂无${this.props.project.curVersion?this.props.project.curVersion+"版本的":""}接口数据`}
            </div>
          </div>:"无数据"
        }
      </div>
    )
  }
}



export default Editor
