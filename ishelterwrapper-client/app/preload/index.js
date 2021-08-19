const { contextBridge } = require('electron');
const request = require('request');
const { CookieJar } = require('request-cookies');
const Store = require('electron-store');

requestsNetApi = {};

requestsNetApi.cookies = new CookieJar();

requestsNetApi.get = function(baseUrl, endpointUrl, callback){
  request ({url: baseUrl+endpointUrl, method: 'GET', headers: {'Cookie': this.getCookies(baseUrl)}}, (err, res, body)=>{
    callback(body, err, res);
  });

}

requestsNetApi.post = function(baseUrl, endpointUrl, data, callback){
  request.post ({url: baseUrl+endpointUrl, form: data, headers: {'Cookie': this.getCookies(baseUrl)}}, (err, res, body)=>{
    let schs = res.headers['set-cookie'];
    if(schs){
      for(var i = 0; i < schs.length; i++){
          this.cookies.add(schs[i], baseUrl);
      }
    }
    callback(body, err, res);
  });
}

requestsNetApi.getCookies = function(baseUrl){
  let setCookie = [];
  let cookiesArray = this.cookies.getCookies(baseUrl);
  for(var i = 0; i < cookiesArray.length; i++){
    setCookie.push(cookiesArray[i].getCookieHeaderString());
  }
  return setCookie.join('; ');
}

requestsNetApi.get = requestsNetApi.get.bind(requestsNetApi);
requestsNetApi.post = requestsNetApi.post.bind(requestsNetApi);
requestsNetApi.getCookies = requestsNetApi.getCookies.bind(requestsNetApi);

contextBridge.exposeInMainWorld('requestsNetApi', requestsNetApi);

let config = new Store();

contextBridge.exposeInMainWorld('config', {
  get: function(key){
    return config.get(key);
  },
  set: function(key, value){
    return config.set(key, value);
  }
});