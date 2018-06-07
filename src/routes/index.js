import AsyncComponent from '../components/AsyncComponent'
import RenderComponent from '../components/RenderComponent'
import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react'
import Course from "./course"


const Routes = () => (
  <Switch>
    <Route path="/" render={props=><RenderComponent {...props} component={()=>import('./project')} ></RenderComponent>} />
    <Redirect from="*" to="/" />
  </Switch>
)

export default Routes
