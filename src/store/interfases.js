import { observable, action, useStrict, computed, runInAction } from 'mobx'
import Mock from 'mockjs'
import project from './project'
import Config from '@/config'
import fetchApi from '@/api'
import config from '../config'
import { mergeData } from '../utils'

function parseStrToObj(str) {
  try {
    return new Function(`return ${str};`)()
  } catch (e) {
    console.log(e)
  }
  return null
}

function byIndexFind(index, num, data) {
  for (let i = 0; i < data.children.length; i++) {
    if (num >= index) {
      return { data, i }
    }
    num++
    if (data.children[i].children && data.children[i].children.length > 0) {
      num = byIndexFind(index, num, data.children[i])
      if (typeof num === 'object') {
        return num
      }
    }
  }
  return num
}

//import axios from 'axios';
useStrict(true)

class Interfase {
  @observable editable = false
  @observable loadRemarkMoreVisible = true
  @observable showLeadInModal = false
  @observable data = {
    name: '',
    method: '',
    url: '',
    res: [],
    headers: [],
    paths: [],
    remarks: [],
    req: [],
    versions: []
  }

  @observable resCode = ''
  @observable reqCode = ''
  timer = {
    res: null,
    req: null
  }

  @computed get resModel() {
    let model = JSON.parse(JSON.stringify(this.data.res))
    function removeKey(data) {
      for (let item of data) {
        delete item.key
        if (item.children) {
          item.children = removeKey(item.children)
        }
      }
      return data
    }

    return JSON.stringify(removeKey(model), null, 2)
  }
  @computed get reqModel() {
    let model = JSON.parse(JSON.stringify(this.data.req))
    function removeKey(data) {
      for (let item of data) {
        delete item.key
        if (item.children) {
          item.children = removeKey(item.children)
        }
      }
      return data
    }
    return JSON.stringify(removeKey(model), null, 2)
  }

  @computed get remarks() {
    return this.data.remarks
  }

  @computed get realProxyUrl() {
    return project.info.useGlobalProxy || !this.data.proxyUrl
      ? project.info.proxy
      : this.data.proxyUrl
  }

  @computed get resMock() {
    let result = ''
    if (this.data.res) {
      let data = {}
      for (let item of this.data.res) {
        data[
          item.name +
            (!!item.mockNum && item.mockNum !== 0 ? '|' + item.mockNum : '')
        ] = this.formatMock(item)
      }
      result = JSON.stringify(data, null, 2).replace(
        /"\$\$\*RegExp\*\$\$(.*)\$\$\*RegExp\*\$\$"/g,
        ($, $1) => {
          return `/${$1.replace(/\\\\/g, '\\')}/`
        }
      )
    }
    return result
  }

  @computed get reqMock() {
    let result = ''
    if (this.data.res) {
      let data = {}
      for (let item of this.data.req) {
        data[
          item.name +
            (!!item.mockNum && item.mockNum !== 0 ? '|' + item.mockNum : '')
        ] = this.formatMock(item)
      }
      result = JSON.stringify(data, null, 2).replace(
        /"\$\$\*RegExp\*\$\$(.*)\$\$\*RegExp\*\$\$"/g,
        ($, $1) => {
          return `/${$1.replace(/\\\\/g, '\\')}/`
        }
      )
    }
    return result
  }

  @computed get headerTest() {
    if (
      !this.data.headers.length === 0 &&
      !project.info.gatewayTemplate.headers
    ) {
      return ''
    }

    let data = []
    for (let item of this.data.headers) {
      data.push({ enabled: true, key: item.name, value: item.value })
    }

    if (project.info.gatewayTemplate.headers) {
      for (let i in project.info.gatewayTemplate.headers) {
        data.push({
          enabled: true,
          key: i,
          value: project.info.gatewayTemplate.headers[i]
        })
      }
    }
    if (project.info.checkInfo.type === 1 && project.info.checkInfo.key) {
      let index = data.findIndex(
        item => item.key === project.info.checkInfo.key
      )
      if (index >= 0) {
        data[index].value = project.info.checkInfo.value
      } else {
        data.push({
          enabled: true,
          key: project.info.checkInfo.key,
          value: project.info.checkInfo.value
        })
      }
    }

    if (project.info.checkInfo.type === 3 && project.info.checkInfo.cookieKey) {
      let index = data.findIndex(item => item.key === 'cookie')
      let value =
        project.info.checkInfo.cookieKey +
        '=' +
        project.info.checkInfo.cookieValue
      if (index >= 0) {
        data[index].value = value
      } else {
        data.push({ enabled: true, key: 'cookie', value: value })
      }
    }

    return encodeURIComponent(JSON.stringify(data))
  }

  @computed get reqTest() {
    let method = this.data.method.toUpperCase()
    if (!this.data.req.length === 0) {
      return ''
    }

    let mockData = parseStrToObj(this.reqCode)

    if (method === 'POST' || method === 'PUT') {
      return '&body=' + encodeURIComponent(JSON.stringify(mockData, null, 2))
    } else {
      let data = []
      for (let key in mockData) {
        // if(mockData[key]&&mockData[key].constructor===Array){
        //   for(let i in mockData[key]){
        //     data.push({"enabled": true, "key": `${key}[${i}]`, "value": mockData[key][i]})
        //   }
        // }else
        if (!!mockData[key] && typeof mockData[key] === 'object') {
          data.push({
            enabled: true,
            key: key,
            value: JSON.stringify(mockData[key])
          })
        } else {
          data.push({ enabled: true, key: key, value: mockData[key] })
        }
      }
      return '&queryParameters=' + encodeURIComponent(JSON.stringify(data))
    }
  }

  @computed get testUrl() {
    if (!this.data.id) {
      return ''
    }
    let url = this.data.url
    this.data.paths.forEach(item => {
      url = url.replace(`{${item.name}}`, item.value || 1)
    })
    let proxy = project.info.proxy
    return `${Config.baseURL}project/test/${
      project.projectId
    }/${url}#!title=${encodeURIComponent(
      this.data.name
    )}&url=${proxy}&method=${this.data.method.toUpperCase()}&headers=${
      this.headerTest
    }${this.reqTest}`.replace(/([^:])\/\//, '$1/')
  }

  formatMock(item) {
    try {
      if (!item.children || item.children.length === 0 || item.mockValue) {
        if (item.mockValue) {
          if (
            item.mockType === 'Array' &&
            /^\[[\s\S]*\]$/m.test(item.mockValue)
          ) {
            return parseStrToObj(item.mockValue)
          } else if (
            item.mockType === 'Object' &&
            /^{[\s\S]*}$/m.test(item.mockValue)
          ) {
            return parseStrToObj(item.mockValue)
          } else if (item.mockType === 'String') {
            return '' + item.mockValue
          } else if (
            item.mockType === 'Number' &&
            /^[0-9.+-]*$/m.test(item.mockValue)
          ) {
            return Number(item.mockValue)
          } else if (
            item.mockType === 'Boolean' &&
            /^true|false$/m.test(item.mockValue)
          ) {
            return parseStrToObj(item.mockValue)
          } else if (item.mockType === 'RegExp') {
            return `$$*RegExp*$$${item.mockValue}$$*RegExp*$$`
          } else {
            return item.mockValue
          }
        } else {
          if (item.type === 'Array') {
            return []
          } else if (item.type === 'Object') {
            return {}
          } else if (item.type === 'String') {
            return ''
          } else if (
            item.type === 'Number' ||
            item.type === 'Float' ||
            item.type === 'Integer'
          ) {
            return null
          } else if (item.type === 'Boolean') {
            return false
          } else {
          }
        }
        return ''
      }

      let data = {}
      for (let child of item.children) {
        data[
          child.name +
            (!!child.mockNum && child.mockNum !== 0 ? '|' + child.mockNum : '')
        ] = this.formatMock(child)
      }

      if (item.mockType === 'Array') {
        return [data]
      } else {
        return data
      }
    } catch (e) {
      return item.mockValue
    }
  }

  formatCode(key, value, id) {
    function judgeType(value) {
      if (!value && value !== 0) {
        return 'String'
      }
      if (value.constructor === Array) {
        return 'Array'
      } else if (value.constructor === Date) {
        return 'Date'
      } else if (value.constructor === RegExp) {
        return 'RegExp'
      } else {
        return (typeof value).replace(/./, $ => $.toUpperCase())
      }
    }
    let data = {
      key: id,
      name: key,
      type: judgeType(value),
      required: true,
      mockType: judgeType(value),
      mockNum: '',
      mockValue: typeof value === 'object' || value === null ? '' : value,
      description: ''
    }
    if (value && typeof value === 'object') {
      data.children = []
      if (value.constructor === Array) {
        if (typeof value[0] === 'string') {
          data.mockValue = JSON.stringify(value)
          return data
        } else {
          value = value[0]
        }
      }

      let num = 0
      for (let i in value) {
        num++
        data.children.push(this.formatCode(i, value[i], id + '-' + num))
      }
    }
    return data
  }

  @action.bound leadInRes(code, target = [], increment = false) {
    if (typeof code === 'string') {
      code = parseStrToObj(code)
    }
    if (code.constructor === Array) {
      code = code[0]
    }
    let newCode = []
    let id = Date.now()

    if (target && target.length) {
      let targetObj = target.reduce(
        (total, item) => {
          if (!total || !total.children || !total.children.length) {
            return total
          }
          let data = total.children.find(val => val.name === item)
          return data || null
        },
        { children: this.data.res }
      )

      if (targetObj) {
        for (let i in code) {
          newCode.push(
            this.formatCode(
              i,
              code[i],
              targetObj.key +
                '-' +
                id +
                parseInt(Math.random() * 10000000000) +
                i.replace(/-/g, '_')
            )
          )
        }
        if (increment) {
          targetObj.children = mergeData(
            targetObj.children || [],
            newCode,
            targetObj.key
          )
        } else {
          targetObj.children = (targetObj.children || []).concat(newCode)
        }
      }
    } else {
      for (let i in code) {
        newCode.push(
          this.formatCode(
            i,
            code[i],
            id + parseInt(Math.random() * 10000000000) + i.replace(/-/g, '_')
          )
        )
      }
      if (increment) {
        this.data.res = mergeData(this.data.res.slice(), newCode, '')
      } else {
        this.data.res = this.data.res.slice().concat(newCode)
      }
    }

    this.changeCode('res')
  }

  @action.bound leadInReq(code, target = [], increment = false) {
    if (typeof code === 'string') {
      code = parseStrToObj(code)
    }
    if (code.constructor === Array) {
      code = code[0]
    }
    let newCode = []
    let id = Date.now()

    if (target && target.length) {
      let targetObj = target.reduce(
        (total, item) => {
          if (!total || !total.children || !total.children.length) {
            return total
          }
          let data = total.children.find(val => val.name === item)
          return data || null
        },
        { children: this.data.req }
      )

      if (targetObj) {
        for (let i in code) {
          newCode.push(
            this.formatCode(
              i,
              code[i],
              targetObj.key +
                '-' +
                id +
                parseInt(Math.random() * 10000000000) +
                i.replace(/-/g, '_')
            )
          )
        }

        if (increment) {
          targetObj.children = mergeData(targetObj.children || [], newCode)
        } else {
          targetObj.children = (targetObj.children || []).concat(newCode)
        }
      }
    } else {
      for (let i in code) {
        newCode.push(
          this.formatCode(
            i,
            code[i],
            id + parseInt(Math.random() * 10000000000) + i.replace(/-/g, '_')
          )
        )
      }
      if (increment) {
        this.data.req = mergeData(this.data.req.slice(), newCode)
      } else {
        this.data.req = this.data.req.slice().concat(newCode)
      }
    }

    this.changeCode('req')
  }

  @action.bound leadInModel(type, code, target) {
    if (typeof code === 'string') {
      code = parseStrToObj(code)
    }

    let id = Date.now()

    function addKey(data, id) {
      let num = 0
      for (let item of data) {
        let newId = id + '-' + num
        item.key = newId
        if (item.children) {
          addKey(item.children, newId)
        }
        num++
      }
    }

    if (target && target.length) {
      let targetObj = target.reduce(
        (total, item) => {
          if (!total || !total.children || !total.children.length) {
            return total
          }
          let data = total.children.find(val => val.name === item)
          return data || null
        },
        { children: this.data[type] }
      )

      if (targetObj) {
        for (let item of code) {
          let newId =
            targetObj.key +
            '-' +
            id +
            parseInt(Math.random() * 10000000000) +
            item.name.replace(/-/g, '_')
          item.key = newId
          if (item.children) {
            addKey(item.children, newId)
          }
        }
        targetObj.children = (targetObj.children || []).concat(code)
      }
    } else {
      for (let item of code) {
        let newId =
          id +
          parseInt(Math.random() * 10000000000) +
          item.name.replace(/-/g, '_')
        item.key = newId
        if (item.children) {
          addKey(item.children, newId)
        }
      }

      if (type === 'res') {
        this.data.res = this.data.res.toJS().concat(code)
        this.changeCode('res')
      } else {
        this.data.req = this.data.req.toJS().concat(code)
        this.changeCode('req')
      }
    }
  }

  @action.bound changeProxyType(val) {
    this.data.proxyType = val
  }

  @action.bound changeSort(type, dragIndex, hoverIndex) {
    const data = this.data[type].slice()
    let target = {
      children: data
    }
    let drag = byIndexFind(dragIndex, 0, target)
    let hover = byIndexFind(hoverIndex, 0, target)
    if (hover.data !== drag.data) {
      return
    }

    let back = drag.data.children[drag.i]
    hover.data.children.splice(drag.i, 1)
    hover.data.children.splice(hover.i, 0, back)

    this.data[type] = data
    this.changeCode(type)
  }

  @action.bound changeField(type, value, key, column) {
    const data = this.data[type].slice()
    const keys = key.split('-')
    let curKey = ''
    let target = {
      children: data
    }
    for (let i = 0; i < keys.length; i++) {
      curKey += keys[i]
      target = target.children.filter(item => curKey === item.key)[0]
      curKey += '-'
    }
    if (target) {
      target[column] = value
      if (column === 'type') {
        if (value === 'Float' || value === 'Integer') {
          target['mockType'] = 'Number'
        } else {
          target['mockType'] = value
        }
        if (value !== 'Array' && value !== 'Object') {
          target.children = null
        }
      }
    }

    this.data[type] = data

    this.changeCode(type)
  }

  @action.bound changeHeadersField(value, key, column) {
    const data = this.data.headers.slice()
    let index = data.findIndex(item => item.key === key)
    this.data.headers[index][column] = value
  }

  @action.bound changePathsField(value, key, column) {
    const data = this.data.paths.slice()
    let index = data.findIndex(item => item.key === key)
    this.data.paths[index][column] = value
  }

  @action.bound delHeadersRow(key) {
    const data = this.data.headers.slice()
    let index = data.findIndex(item => item.key === key)
    data.splice(index, 1)
    this.data.headers = data
  }
  @action.bound addHeadersRow() {
    this.data.headers.push({
      name: '',
      key: Date.now(),
      description: '',
      value: ''
    })
  }

  @action.bound delField(type, key) {
    const data = this.data[type].slice()
    const keys = key.split('-')
    let curKey = ''
    let target = {
      children: data
    }

    for (let i = 0; i < keys.length; i++) {
      curKey += keys[i]
      if (i === keys.length - 1) {
        let index = target.children.findIndex(item => curKey === item.key)
        target.children.splice(index, 1)
      } else {
        target = target.children.filter(item => curKey === item.key)[0]
      }

      curKey += '-'
    }
    this.data[type] = data
    this.changeCode(type)
  }

  @action.bound addValue({ type, key, value }) {
    if (!key) {
      this.data[type].push(value)
      return
    }
    value.required = true
    const keys = key.split('-')
    let curKey = ''
    let target = {
      children: this.data[type].slice()
    }
    for (let i = 0; i < keys.length; i++) {
      curKey += keys[i]
      target = target.children.filter(item => curKey === item.key)[0]
      curKey += '-'
    }
    if (target) {
      value.key = key + '-' + value.key
      if (!target.children) {
        target.children = []
      }
      target.children.push(value)
    }
    this.changeCode(type)
  }

  @action.bound changeCode(type) {
    clearTimeout(this.timer[type])
    this.timer[type] = setTimeout(() => {
      this.createCode(type)
    }, 500)
  }

  @action.bound createCode(type) {
    if (type === 'res' && this.resMock) {
      let data = Mock.mock(parseStrToObj(this.resMock))
      if (data.array_type_data && data.array_type_data.constructor === Array) {
        data = data.array_type_data
      }
      data = JSON.stringify(data, null, 2)
      if (project.info.gatewayTemplate.res) {
        let resTemplate = JSON.stringify(project.info.gatewayTemplate.res)
        if (data === '{}') {
          data = resTemplate.replace(/"\$data"/, 'null')
        } else if (resTemplate.search(/"\$data"/) >= 0) {
          data = resTemplate.replace(/"\$data"/, data)
        } else if (resTemplate !== '{}') {
          data = resTemplate.replace(/^{/, data.replace(/\}$/, ','))
        }
        data = JSON.stringify(JSON.parse(data), null, 2)
      }
      this.resCode = data
    } else if (this.reqMock) {
      let data = Mock.mock(parseStrToObj(this.reqMock))

      if (data.array_type_data && data.array_type_data.constructor === Array) {
        data = data.array_type_data
      }
      data = JSON.stringify(data, null, 2)
      if (project.info.gatewayTemplate.req) {
        let reqTemplate = JSON.stringify(project.info.gatewayTemplate.req)
        if (data === '{}') {
          data = reqTemplate.replace(/"\$data"/, 'null')
        } else if (reqTemplate.search(/"\$data"/) >= 0) {
          data = reqTemplate.replace(/"\$data"/, data)
        } else if (reqTemplate !== '{}') {
          data = reqTemplate.replace(/^{/, data.replace(/\}$/, ','))
        }
        data = JSON.stringify(JSON.parse(data), null, 2)
      }
      this.reqCode = data
    }
  }

  @action.bound loadRemarkMore() {
    this.loadRemarkMoreVisible = false
  }
  @action.bound openEditable() {
    this.editable = true
  }
  @action.bound closeEditable() {
    this.editable = false
  }

  @action.bound addVersion(version) {
    this.data.versions.push(version)
  }

  @action.bound addRemark(info) {
    return fetchApi.fetchAddRemark(info).then(data => {
      this.getRemark()
      return data
    })
  }
  @action.bound getRemark() {
    return fetchApi.fetchGetInterfaseRemark(this.data.id).then(data => {
      runInAction(() => {
        this.data.remarks = data.remarks
        project.interfase.remarks = data.remarks
      })
      return data
    })
  }

  @action.bound deleteRemark(id) {
    return fetchApi.fetchDeleteRemark(id).then(data => {
      this.getRemark()
      return data
    })
  }
  @action.bound editRemark(id, info) {
    return fetchApi.fetchUpdateRemark(id, info).then(data => {
      this.getRemark()
      return data
    })
  }

  @action.bound fetchGetInterfase(id) {
    return fetchApi.fetchGetInterfase(id).then(data => {
      this.getInterfaseData(data, true)
      return data
    })
  }

  @action.bound getInterfaseData(data, noflush) {
    this.data = {
      ...data
    }
    if (!noflush) {
      this.editable = false
      this.loadRemarkMoreVisible = true
    }

    interfases.changeCode('req')
    interfases.changeCode('res')
    window.history.pushState(
      null,
      null,
      `${window.location.pathname}?moduleId=${data.moduleId}&interfaseId=${
        data.id
      }`
    )
  }

  @action.bound refreshCode(type) {
    if (type) {
      interfases.changeCode(type)
      return
    }
    interfases.changeCode('req')
    interfases.changeCode('res')
  }

  @action.bound syncSwaggerData() {
    return fetchApi.fetchInterfaseSyncSwaggerData(this.data.id).then(data => {
      project.getProjectData(this.data.projectId)
      return data
    })
  }
  @action.bound
  recoveryRecord(history) {
    this.data = history
  }
}

const interfases = new Interfase()

export default interfases
