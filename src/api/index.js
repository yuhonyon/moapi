import http from "./http.js";




const fetchApi={
  fetchGetProjectList(params){
    return http.get(`/`,params).then(data=>{
      return data;
    })
  },
  fetchSignin(params){
    return http.post(`/users/signin`,params).then(data=>{
      return data;
    })
  },
  fetchSignup(params){
    return http.post(`/users`,params).then(data=>{
      return data;
    })
  },


  fetchUpdateInterfase(interfaseId,params){
    return http.put(`/interfase/${interfaseId}`,params).then(data=>{
      return data;
    })
  },

  fetchAddInterfase(params){
    return http.post(`/interfase`,params).then(data=>{
      return data;
    })
  },

  fetchDeleteInterfase(interfaseId){
    return http.delete(`/interfase/${interfaseId}`).then(data=>{
      return data;
    })
  },


  fetchUpdateModule(moduleId,params){
    return http.put(`/module/${moduleId}`,params).then(data=>{
      return data;
    })
  },

  fetchAddModule(params){
    return http.post(`/module`,params).then(data=>{
      return data;
    })
  },

  fetchDeleteModule(moduleId){
    return http.delete(`/module/${moduleId}`).then(data=>{
      return data;
    })
  },

  fetchGetProjectInfo(id){
    return http.get(`/project/${id}`).then(data=>{
      return data;
    })
  },

  fetchGetInterfaseRecord(interfaseId){
    return http.get(`/record/interfase/${interfaseId}`).then(data=>{
      return data;
    })
  },

}


export default fetchApi;
