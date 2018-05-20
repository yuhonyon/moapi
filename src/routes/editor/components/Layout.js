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
          this.props.project.data.modules.length!==0?<div className={Style.content}>
            <div className={Style.menu}>
              <InterfaseMenu
                interfases={this.props.project.interfases} moduleId={this.props.project.moduleId}></InterfaseMenu>
            </div>
            <div className={Style.main}>
              <Interfase></Interfase>
            </div>
          </div>:"无数据"
        }
      </div>
    )
  }
}



export default Editor
