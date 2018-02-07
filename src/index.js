import React from 'react';
import ReactDOM from 'react-dom';
import CoreLayout from './layout/Main';
import registerServiceWorker from './registerServiceWorker';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import {LocaleProvider} from 'antd';
import {BrowserRouter} from 'react-router-dom'
import store from './store';
import {Provider} from 'mobx-react';
import {RouterStore} from 'mobx-react-router';
const routerStore = new RouterStore();

store.router=routerStore;
ReactDOM.render(<Provider {...store}>
  <BrowserRouter>
    <LocaleProvider locale={zhCN}>
      <CoreLayout/>
    </LocaleProvider>
  </BrowserRouter>
</Provider>, document.getElementById('root'));
registerServiceWorker();
