import AsyncComponent from '../components/AsyncComponent'
import RenderComponent from '../components/RenderComponent'
import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react'
import Course from "./course"


const Routes = () => (
  <Switch>
    <Route path="/project/:projectId" render={props=><RenderComponent {...props} component={()=>import('./project')} ></RenderComponent>} />
    <Redirect from="*" to="/project/1" />
  </Switch>
)

export default Routes
