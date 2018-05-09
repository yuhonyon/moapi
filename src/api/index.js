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

  fetchCreateInterfase(params){
    return http.post(`/interfase`,params).then(data=>{
      return data;
    })
  },

  fetchGetProjectInfo(id){
    return http.get(`/project/${id}`).then(data=>{
      return data;
    })
  }
}


export default fetchApi;
