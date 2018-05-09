import React from "react";
import InterfaseMenu from './InterfaseMenu'
import { Switch, Route } from 'react-router-dom'
import Interfase from './Interfase'
import Style from './Module.less'
export default class Module extends React.Component {

  render(){
    return (
      <div className={Style.wrapper}>
        <div className={Style.menu}>
          <InterfaseMenu rootPath={this.props.match.url}></InterfaseMenu>
        </div>
        <div className={Style.route}>
          <Switch>
            <Route path="/editor/:projectId/:moudleId/:interfaseId" component={Interfase} />
          </Switch>
        </div>


      </div>
    )
  }
}
