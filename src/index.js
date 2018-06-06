import React from 'react';
import ReactDOM from 'react-dom';
import CoreLayout from './layout/Main';
import registerServiceWorker from './registerServiceWorker';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import enUS from 'antd/lib/locale-provider/en_US'
import {LocaleProvider} from 'antd';
import {BrowserRouter,Switch, Route, Redirect } from 'react-router-dom'
import store from './store';
import {Provider} from 'mobx-react';

import asyncComponent from './components/AsyncComponent'
import _zhCN from './locale/zh-CN.json'
import _enUS from './locale/en-US.json'
import "./assets/style/common.less"
import intl from "react-intl-universal";

const lang=localStorage.getItem("lang")||"zh-CN";

intl.init({
  currentLocale:lang,
  locales: {
    [lang]: lang==="zh-CN"?_zhCN:_enUS
  }
});


ReactDOM.render(<Provider {...store}>
  <BrowserRouter>
    <LocaleProvider locale={lang==="zh-CN"?zhCN:enUS}>
      <Switch>
        <Route path="/" component={CoreLayout} />
      </Switch>
    </LocaleProvider>
  </BrowserRouter>
</Provider>, document.getElementById('root'));
registerServiceWorker();
