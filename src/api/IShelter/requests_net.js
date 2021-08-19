window.dbgRequestsNetPrimaryInst = null;

window.dbgRequestsNetClear = function(){
  if(window.dbgRequestsNetPrimaryInst){
    window.dbgRequestsNetPrimaryInst.cookies.remove(window.dbgRequestsNetPrimaryInst.baseUrl);
  }
}

export default class RequestsNet{

  constructor(baseUrl){
    this.baseUrl = baseUrl;
    window.dbgRequestsNetPrimaryInst = this;
  }

  get(url, callback, errorCallback){
    window.requestsNetApi.get(this.baseUrl, url, callback);
  }

  post(url, data, callback){
    window.requestsNetApi.post(this.baseUrl, url, data, callback);
  }

}
