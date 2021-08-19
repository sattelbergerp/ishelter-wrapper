import Network from './net';
import CatsApi from './catsapi.js';

export default class IShelterApi{

  constructor(config, errorCallback){
    this.queue = [];
    this.config = config;
    this.net = new Network('https://ishelter.ishelters.com', (error, rawError)=>{
      console.log('Fatal network error');
      errorCallback({api: this, error: error, rawError: rawError});
    });
    this.cats= new CatsApi(this);
  }

  add(request){
    this.queue.push(request);
    if(this.queue.length < 2){
      this.processNext();
    }
  }

  login(username, password, callback){
    this.makeRequest ({method:'POST', url:'/loginProcess.php', data:{email: username, password: password}},(body,err,res)=>{

      this.makeRequest ({method:'GET', url:'/of/'},(body1,err1,res1)=>{
        let doc = new DOMParser().parseFromString(body1, 'text/html');
        let ok = !!doc.querySelector('a[href*=profile]');
        callback(ok, ok?doc.querySelector('a[href*=profile]').innerHTML:null);
        if(ok && this.onLogin)this.onLogin();
      });

    });
  }

  processNext(){
    let request = this.queue.splice(0, 1)[0];
    let callback = (body, err, res)=>{
      if(body.includes(' Ooops! Login First!')){
        this.onLogin = ()=>{
          this.processNext();
        }
        this.queue.splice(0, 0, request);
        if(window.config.get('autologin.user') && window.config.get('autologin.pass')){
          this.login(window.config.get('autologin.user'), window.config.get('autologin.pass'), function(ok, name){
            if(ok){
              console.log('Automatically signed in as ' + name)
            }else{
              console.log('Auto sign in failed')
              this.onLoginNeeded(this);
            }
          });
        }else{
          if(this.onLoginNeeded){
            this.onLoginNeeded(this);
          }else{
            console.log('Please specify api.onLoginNeeded callback');
          }
        }
        
        return;
      }
      request.callback(body, err, res);
      if(this.queue.length > 0)this.processNext();
    }

    this.makeRequest(request, callback);
  }

  makeRequest(request, callback){
    if(request.method==='GET'){
      this.net.get(request.url, callback);
    }else if(request.method==='POST'){
      this.net.post(request.url, request.data, callback);
    }else{
      console.log('[ERROR] Unsupported HTTP Method: ' + request.method);
    }
  }

  get(url, callback){
    this.add({method: 'GET', url: url, callback: callback});
  }

  post(url, data, callback){
    this.add({method: 'POST', url: url, callback: callback, data: data});
    //this.net.post(url, data, callback);
  }

}
