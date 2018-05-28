import {observable, action, useStrict, computed, runInAction} from 'mobx';
import fetchApi from '@/api'
import interfases from './interfases'
import Config from "../config"
import {getQuery} from '../utils'
useStrict(true);

class Project {
  @observable moduleId = null;
  @observable interfaseId = null;
  @observable module = {};
  @observable interfases = [];
  @observable interfase = {};
  @observable curVersion = "";

  @observable info={
    admin:{
      name:null
    },
    versions:[]
  }

  @observable data = {
    admin: {},
    id: null,
    description: '',
    modules: [
      {
        name: "院内",
        id: 1,
        interfases: [
          {
            name: "接口一",
            id: 1
          }
        ]
      }
    ],
    members: [],
    record: []
  }

  @computed
  get inVersionInterfases() {
    if(!this.curVersion){return this.interfases};
    return this.interfases.slice().filter(item=>(
      item.versions.includes(this.curVersion)
    ))
  }
  @computed
  get mdDownloadUrl() {
    return Config.baseURL + 'project/md/' + this.projectId
  }
  @computed
  get docUrl() {
    return Config.baseURL + 'project/doc/' + this.projectId
  }

  @computed
  get serverUrl() {
    return Config.baseURL + 'project/server/' + this.projectId
  }

  @computed
  get mockUrl() {
    return Config.baseURL + 'project/mock/' + this.projectId
  }

  @computed
  get modules() {
    return this.data.modules
  }

  @computed
  get projectId() {
    return this.data.id
  }

  @computed
  get permission() {
    return this.info.permission
  }

  @action.bound
  getProjectData(projectId) {
    return fetchApi.fetchGetProjectData(projectId).then(data => {
      runInAction(() => {
        this.data = data;
        //v
        this.selectInterfase(Number(getQuery(window.location.search, "moduleId")), Number(getQuery(window.location.search, "interfaseId")));
      })
      return data;
    })
  }

  @action.bound
  getProjectInfo(projectId) {
    return fetchApi.fetchGetProjectInfo(projectId).then(data => {
      runInAction(() => {
        this.info = data;
      })
      return data;
    })
  }
  @action.bound
  selectInterfase(moduleId, interfaseId) {
    if (!moduleId) {

      this.moduleId = this.modules.length && this.modules[0].id;
      this.module = this.modules.length && this.modules[0];
      this.interfases = this.module.interfases || [];
      this.interfase = (this.interfases.length && this.interfases[0]) || {};
      this.interfaseId = this.interfase.id || null;
    } else if (moduleId && !interfaseId) {
      this.module = this.modules.find(val => val.id === moduleId) || {}
      this.moduleId = moduleId;
      this.interfases = this.module.interfases || [];
      this.interfase = (this.interfases.length && this.interfases[0]) || {};
      this.interfaseId = this.interfase.id || null;
    } else {
      this.moduleId = moduleId;
      this.module = this.modules.find(val => val.id === moduleId) || {}
      this.interfases = this.module.interfases || [];
      this.interfaseId = interfaseId;
      this.interfase = this.interfases.find(val => val.id === interfaseId) || {}
    }
    if(this.interfase.id){
      interfases.getInterfaseData(this.interfase)
    }
  }

  @action.bound
  deleteInterfase(interfaseId) {
    return fetchApi.fetchDeleteInterfase(interfaseId).then(data => {
      this.getProjectData(this.projectId);
      if (interfaseId === this.interfaseId) {
        this.selectInterfase(this.moduleId);
      }
      return data;
    })
  }

  @action.bound
  updateInterfase(interfaseId, interfase) {
    this.selectInterfase(interfase.moduleId, interfaseId)
    delete interfase.remarks;
    console.log(interfase)
    return fetchApi.fetchUpdateInterfase(interfaseId, interfase).then(data => {
      this.getProjectData(this.projectId)
      return data;
    })
  }

  @action.bound
  addInterfase(interfase) {
    return fetchApi.fetchAddInterfase(interfase).then(data => {
      this.getProjectData(interfase.projectId).then(() => {
        this.selectInterfase(interfase.moduleId, interfase.id)
      })
      return data;
    })
  }

  @action.bound
  deleteModule(moduleId) {
    return fetchApi.fetchDeleteModule(moduleId).then(data => {
      this.getProjectData(this.projectId);
      if (moduleId === this.moduleId && this.modules.length) {
        this.selectInterfase(this.modules[0].id);
      }
      return data;
    })
  }

  @action.bound
  updateModule(moduleId, module) {
    this.selectInterfase(moduleId)
    return fetchApi.fetchUpdateModule(moduleId, module).then(data => {
      this.getProjectData(this.projectId)
      return data;
    })
  }

  @action.bound
  addModule(module) {
    return fetchApi.fetchAddModule(module).then(data => {
      this.getProjectData(this.projectId).then(() => {
        this.selectInterfase(data.id)
      })
      return data;
    })
  }


  @action.bound
  updateProject(projectId, project) {
    return fetchApi.fetchUpdateProject(projectId, project).then(data => {

      return data;
    })
  }

  @action.bound
  addVersion(version) {
    const versions=this.info.versions;
    versions.push(version)
    return fetchApi.fetchUpdateProject(this.projectId, {version:version,versions:versions}).then(data => {
      this.getProjectInfo(this.projectId)
      return data;
    })
  }

  @action.bound
  changeCurVersion(version) {
    this.curVersion=version
  }




}

export default new Project()
