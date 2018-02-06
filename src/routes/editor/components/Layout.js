import React from "react";
import Header from './Header'
import ModuleMenu from './ModuleMenu'
import Module from './Module'
import { Switch, Route } from 'react-router-dom'
function Editor(props){
  return (
    <div>
      <Header></Header>
      <ModuleMenu rootPath={props.match.url}></ModuleMenu>
      <Switch>
        <Route path="/editor/:projectId/:moudleId" component={Module} />
      </Switch>
    </div>
  )
}

export default Editor;
