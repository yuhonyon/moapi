import {observable, action, useStrict, computed, runInAction} from 'mobx';
import fetchApi from '@/api'
import interfases from './interfases'
import Config from "../config"
import {getQuery,setCookie} from '../utils'
useStrict(true);

class Project {
  @observable moduleId = null;
  @observable interfaseId = null;
  @observable curVersion = "";

  @observable info ={
    admin:{
      name:null
    },
    checkInfo:{},
    gatewayTemplate:{},
    versions:[],
    docs:[],
    docMenu:[]
  }

  @observable data = {
    admin: {},
    id: null,
    description: '',

    modules: [
    ],
    members: [],
    record: []

  }

  @computed
  get module() {
    return this.modules.find(item=>item.id===this.moduleId)||{}
  }

  @computed
  get interfase() {
    return this.interfases.find(item=>item.id===this.interfaseId)||{}
  }

  @computed
  get interfases() {
    return this.module.interfases||[]
  }

  @computed
  get docs() {
    return this.info.docs||[]
  }

  @computed
  get inVersionModules() {
    if(!this.curVersion){return this.data.modules};
    return this.data.modules.slice().filter(item=>!!item.interfases.find(interfase=>interfase.versions.includes(this.curVersion)))
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
    return fetchApi.fetchGetProjectData(projectId||this.projectId).then(data => {
      runInAction(() => {
       
        this.data = data;
        //v
        this.selectInterfase(Number(getQuery(window.location.search, "moduleId")), Number(getQuery(window.location.search, "interfaseId")));
      })
      return data;
    })
  }

  @action.bound
  getProjectInfo(projectId=this.projectId) {
    return fetchApi.fetchGetProjectInfo(projectId).then(data => {
      runInAction(() => {
        this.info = data;
      })
      if(data.checkInfo.type===3&&data.checkInfo.cookieKey){
        setCookie(data.checkInfo.cookieKey,data.checkInfo.cookieValue)
      }
      return data;
    })
  }
  
  @action.bound
  changeDocMenu(data){
    this.info.docMenu=data;
  }

  @action.bound
  selectInterfase(moduleId, interfaseId) {
    if(moduleId&&interfaseId){
      this.moduleId = moduleId;
      this.interfaseId = interfaseId;
      setTimeout(()=>{
        if(this.interfase.id){
          interfases.getInterfaseData(this.interfase)
        }
      },0)
      return;
    }

    if (!moduleId) {
      this.moduleId = this.inVersionModules.length && this.inVersionModules[0].id;
    } else if (moduleId) {
      this.moduleId = moduleId;
    }

    setTimeout(()=>{
      runInAction(()=>{
        this.interfaseId = this.inVersionInterfases.length&&this.inVersionInterfases[0].id;
        setTimeout(()=>{
          if(this.interfase.id){
            interfases.getInterfaseData(this.interfase)
          }
        },0)
      })
    },0)



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
    return fetchApi.fetchUpdateInterfase(interfaseId, interfase).then(data => {
      this.getProjectData(this.projectId).then(()=>{
        this.selectInterfase(interfase.moduleId, interfaseId)
      })
      return data;
    })
  }

  @action.bound
  addInterfase(interfase) {
    return fetchApi.fetchAddInterfase(interfase).then(data => {
      this.getProjectData(data.projectId).then(() => {
        this.selectInterfase(data.moduleId, data.id)
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
    this.curVersion=version;
    if(!this.interfase.id||!this.interfase.versions.includes(version)){
      setTimeout(()=>{
        this.selectInterfase()
      },0)
    }
  }

  @action.bound
  importSwagger(params) {
    return fetchApi.fetchImportSwagger(this.projectId, params).then(data => {
      this.getProjectData(this.projectId);
      return data;
    })
  }

  @action.bound
  saveDoc(params={projectId:this.projectId}) {
    return fetchApi.fetchSaveDoc(params).then(data => {
      this.getProjectInfo(this.projectId);
      return data;
    })
  }

  @action.bound
  addDoc(params={projectId:this.projectId}) {
    return fetchApi.fetchAddDoc(params).then(data => {
      this.getProjectInfo(this.projectId);
      return data;
    })
  }

  @action.bound
  changeInterfaseSort(from,to){
    return fetchApi.fetchChangeInterfaseSort({moduleId:this.moduleId,from,to}).then(data => {
      this.getProjectData(this.projectId);
      return data;
    })
  }








}

export default new Project()
