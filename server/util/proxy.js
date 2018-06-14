import axios from 'axios';
import pathToRegexp from 'path-to-regexp';


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

export default function proxy(ctx,next,path,options) {
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

          if(requestOpts.headers.host){
            requestOpts.headers.host=options.host.replace(/.*:\/\//,'').replace(/\//,'');
          }

//console.log(requestOpts)

          axios(requestOpts)
              .then(response => {
                  resolve(response)
              })
              .catch(err => {
                  reject(err)
              });
    })

};
