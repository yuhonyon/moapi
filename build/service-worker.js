"use strict";var precacheConfig=[["/index.html","efc5b1e3537a428932f17dcd7d0105f7"],["/static/css/main.51678922.css","765d9ec325b3354ffd658dfd80b652f5"],["/static/js/0.b74c6a50.chunk.js","582e92c6da7c2204c16e4cc8f8632d61"],["/static/js/1.d3beb075.chunk.js","c00b0368c6eb3d0556dc549985d1b467"],["/static/js/2.9c7c573c.chunk.js","a725a407418187252f2f9ab71ec7b9b7"],["/static/js/3.fed6f43b.chunk.js","7ff178a0e307caec19a697f5f41a32f4"],["/static/js/4.b6f61242.chunk.js","5437bf410fc81e91a637be3afbe7cec5"],["/static/js/main.212f69f9.js","5c462bdc9e4c2e339b24ad47034c5cac"],["/static/media/iconfont.07fa4ce3.ttf","07fa4ce3eda2850961eb61ba7da28b97"],["/static/media/iconfont.132d8fd2.eot","132d8fd2c3cab34a640d5d9e3cfaa3e0"],["/static/media/iconfont.3a2ba315.ttf","3a2ba31570920eeb9b1d217cabe58315"],["/static/media/iconfont.5aca6085.svg","5aca60856635bc5f965796b049aba6f5"],["/static/media/iconfont.9ec5e40e.eot","9ec5e40edddff9ff300e6791941fe869"],["/static/media/iconfont.ca5d4588.svg","ca5d4588dad9c32f49e895e7f19479df"],["/static/media/iconfont.de3f28fd.woff","de3f28fdd0af647ec0d2b1c22d845064"],["/static/media/mock.b94950ca.snippers","b94950ca7448a50ee265cde46cb17a77"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,n,a){var c=new URL(e);return a&&c.pathname.match(a)||(c.search+=(c.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),c.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return n.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],a=new URL(t,self.location),c=createCacheKey(a,hashParamName,n,/\.\w{8}\./);return[a.toString(),c]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(a){return setOfCachedUrls(a).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return a.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!n.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,n=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),a="index.html";(e=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,a),e=urlsToCacheKeys.has(n));var c="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(n=new URL(c,self.location).toString(),e=urlsToCacheKeys.has(n)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});