import React from 'react';
import ReactDOM from 'react-dom';
import CoreLayout from './layout/Main';
import registerServiceWorker from './registerServiceWorker';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider} from 'antd';
import {BrowserRouter,Switch, Route, Redirect } from 'react-router-dom'
import store from './store';
import {Provider} from 'mobx-react';

import asyncComponent from './components/AsyncComponent'



ReactDOM.render(<Provider {...store}>
  <BrowserRouter>
    <LocaleProvider locale={zhCN}>
      <Switch>
        <Route path="/login" component={asyncComponent(() => import('./routes/login'))} />
        <Route path="/" component={CoreLayout} />
        <Redirect from="*" to="/login" />
      </Switch>
    </LocaleProvider>
  </BrowserRouter>
</Provider>, document.getElementById('root'));
registerServiceWorker();
