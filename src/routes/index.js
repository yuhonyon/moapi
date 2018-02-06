import asyncComponent from '../components/AsyncComponent'
import { Switch, Route, Redirect } from 'react-router-dom'
import React from 'react'


const Routes = () => (
  <Switch>
    <Route path="/project" component={asyncComponent(() => import('./project'))} />
    <Route path="/editor/:projectId" component={asyncComponent(() => import('./editor'))} />
    <Redirect from="*" to="/project" />
  </Switch>
)

export default Routes
