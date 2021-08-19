import RequestsNet from './requests_net';
import FetchNet from './fetch_net';

let NetApi = RequestsNet;

export default class Net{

  constructor(baseUrl, errorCallback){
    this.api = new NetApi(baseUrl);
    this.errorCallback = errorCallback;
  }

  get(url, callback){
    console.time("GET  " + url);
    this.api.get(url, (body,err,res)=>{
      console.timeEnd("GET  " + url);
      callback(body,err,res);
    }, this.errorCallback);
  }

  post(url, data, callback){
    console.log("POST " + url);
    this.api.post(url, data, callback, this.errorCallback);
  }

}
