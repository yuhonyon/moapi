import React from "react";
import InterfaceMenu from './InterfaceMenu'
import { Switch, Route } from 'react-router-dom'
import Interface from './Interface'
import Style from './Module.less'
export default class Module extends React.Component {

  render(){
    return (
      <div className={Style.wrapper}>
        <div className={Style.menu}>
          <InterfaceMenu rootPath={this.props.match.url}></InterfaceMenu>
        </div>
        <div className={Style.route}>
          <Switch>
            <Route path="/editor/:projectId/:moudleId/:interfaceId" component={Interface} />
          </Switch>
        </div>


      </div>
    )
  }
}
