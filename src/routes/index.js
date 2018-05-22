import AsyncComponent from '../components/AsyncComponent'
import RenderComponent from '../components/RenderComponent'
import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react'
import Course from "./course"


const Routes = () => (
  <Switch>
    <Route path="/project/:projectId" render={props=><RenderComponent {...props} component={()=>import('./project')} ></RenderComponent>} />
    <Route path="/project" component={AsyncComponent(() => import('./projectList'))} />
    <Route path="/home" component={AsyncComponent(() => import('./home'))} />

    <Route path="/course" component={Course} />

    <Redirect from="*" to="/login" />
  </Switch>
)

export default Routes
