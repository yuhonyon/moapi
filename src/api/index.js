import http from "./http.js";




const fetchApi={
  http,
  fetchGetSelfProjectList(params){
    return http.get(`/project/self`,params)
  },

  fetchGetDevelopProjectList(params){
    return http.get(`/project/develop`,params)
  },

  fetchGetRelateProjectList(params){
    return http.get(`/project/relate`,params)
  },
  fetchGetProjectList(params){
    return http.get(`/project`,params)
  },
  fetchSignin(params){
    return http.post(`/users/signin`,params)
  },

  fetchSignup(params){
    return http.post(`/users/signup`,params)
  },
  fetchSignout(params){
    return http.get(`/users/signout`,params)
  },

  fetchGetUserList(params){
    return http.get(`/users`,params)
  },


  fetchUpdateInterfase(interfaseId,params){
    return http.put(`/interfase/${interfaseId}`,params)
  },

  fetchAddInterfase(params){
    return http.post(`/interfase`,params)
  },

  fetchGetInterfase(id,params){
    return http.get(`/interfase/${id}`,params)
  },

  fetchDeleteInterfase(interfaseId){
    return http.delete(`/interfase/${interfaseId}`)
  },


  fetchUpdateModule(moduleId,params){
    return http.put(`/module/${moduleId}`,params)
  },

  fetchAddModule(params){
    return http.post(`/module`,params)
  },

  fetchDeleteModule(moduleId){
    return http.delete(`/module/${moduleId}`)
  },

  fetchGetProjectInfo(id){
    return http.get(`/project/info/${id}`)
  },

  fetchGetProjectData(id){
    return http.get(`/project/${id}`)
  },

  fetchUpdateProject(id,params){
    return http.put(`/project/${id}`,params)
  },

  fetchDeleteProject(id){
    return http.delete(`/project/${id}`)
  },
  fetchAddProject(params){
    return http.post(`/project/`,params)
  },
  fetchAddWatchProject(params){
    return http.post(`/users/watch-project/`,params)
  },
  fetchGetWatchProjectList(params){
    return http.get(`/users/watch-project/`,params)
  },

  fetchGetProjectsRecordList(params){
    return http.get(`/record/`,params)
  },

  fetchDeleteWatchProject(params){
    return http.put(`/users/watch-project/`,params)
  },
  fetchGetInterfaseRecord(interfaseId,params){
    return http.get(`/record/interfase/${interfaseId}`,params)
  },

  fetchGetInterfaseRemark(interfaseId,params){
    return http.get(`/interfase/${interfaseId}/remarks`,params)
  },

  fetchAddRemark(params){
    return http.post(`/remark/`,params)
  },
  fetchDeleteRemark(id){
    return http.delete(`/remark/${id}`)
  },
  fetchUpdateRemark(id,info){
    return http.put(`/remark/${id}`,info)
  },

  fetchGetDoc(id){
    return http.get(`/doc/${id}`)
  },
  fetchAddDoc(params){
    return http.post(`/doc/`,params)
  },
  fetchUpdateDoc(id,params){
    return http.put(`/doc/${id}`,params)
  },
  fetchDeleteDoc(id){
    return http.delete(`/doc/${id}`)
  },

  fetchUploadDocFile(projectId,params){
    return http.post(`/doc/file/upload/${projectId}`,params)
  },

  fetchImportSwagger(id,params){
    return http.post(`/project/${id}/swagger`,params)
  },

  fetchInterfaseSyncSwaggerData(id){
    return http.post(`/interfase/${id}/swagger`)
  },

  fetchSaveDoc(params){
    return http.post(`/doc/`,params)
  },
  fetchAddDoc(params){
    return http.post(`/doc/md`,params)
  },

  fetchCheckLogin(params){
    if(!params.url||!params.nameKey||!params.passwordKey){
      return Promise.reject()
    }
    return http.post(params.url,{[params.nameKey]:params.nameValue,[params.passwordKey]:params.passwordValue})
  },
  fetchChangeInterfaseSort(params){
    return http.put(`/module/sort/${params.moduleId}`,params)
  },
  fetchUserInfo(params){
    return http.get(`/users/userInfo`,params)
  },
  fetchSearchInterfase(text){
    return http.get(`/interfase/search`,{keyword:text})
  },

}


export default fetchApi;
