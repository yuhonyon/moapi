import AsyncComponent from '../components/AsyncComponent'
import RenderComponent from '../components/RenderComponent'
import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react'
import Course from "./course"
import About from "./about"

const Routes = () => (
  <Switch>
    <Route path="/project/:projectId" render={props=><RenderComponent {...props} component={()=>import('./project')} ></RenderComponent>} />
    <Route path="/project" component={AsyncComponent(() => import('./projectList'))} />
    <Route path="/home" component={AsyncComponent(() => import('./home'))} />

    <Route path="/doc/:docId" component={AsyncComponent(() => import('./doc'))} />

    <Route path="/course" component={Course} />
    <Route path="/about" component={About} />

    <Redirect from="*" to="/project" />
  </Switch>
)

export default Routes
