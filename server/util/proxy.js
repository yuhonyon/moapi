const axios=require('axios');
const pathToRegexp=require('path-to-regexp');


function replacePathParams(path, params) {
    const keys = [];
    // we don't care about the regexp, just extract the keys
    pathToRegexp(path, keys);

    keys.forEach(k => {
        if (params[k.name]) {
            path = path.replace(':' + k.name, params[k.name]);
        }
    });

    return path;
}

const hasColons = /:/;

module.exports= function proxy(ctx,next,path,options) {
    return new Promise((resolve,reject)=>{
      const shouldReplacePathParams = hasColons.test(path);
      const requestOpts = {
          url: (options.host+"/"+(path || ctx.url)).replace(/([^:])\/\//g,"$1/"),
          method: ctx.method,
          headers:ctx.headers,
          params: ctx.query,
          data:ctx.request.body,
          timeout:10000,
          withCredentials:true,
      };


          // if we have dynamic segments in the url
          if (shouldReplacePathParams) {
              requestOpts.url = options.host + replacePathParams(path, ctx.params);
          }

          // something possibly went wrong if they have no body but are sending a
          // put or a post
          if (requestOpts.method === 'POST' || requestOpts.method === 'PUT') {

              if (!ctx.request.body) {
                  console.warn('sending PUT or POST but no request body found');
              } else {
                  requestOpts.body = ctx.request.body;
              }

              // make request allow js objects if we are sending json
              if (ctx.request.type === 'application/json') {
                  requestOpts.json = true;
              }
          }


          axios(requestOpts)
              .then(response => {
                  resolve(response)
              })
              .catch(err => {
                  reject(err)
              });
    })

};
