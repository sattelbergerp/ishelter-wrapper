export default class FetchNet{

  constructor(baseUrl){
    this.baseUrl = '';
  }

  get(url, callback){
    console.log(this.baseUrl+url);
    fetch(this.baseUrl+url, {method:'GET',credentials:'include', redirect: 'follow'}).then((r)=>{
      return r.text();
    }).then((text)=>{
      callback(text);
    }).catch((err)=>{
      console.error(err);
    });
  }

  post(url, data, callback){
    console.log(this.baseUrl+url + " " + data);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>{
      if(xhr.readyState===4){
        console.log(xhr.getAllResponseHeaders());
        callback(xhr.responseText, null, null);
      }
    }
    xhr.open('POST', this.baseUrl+url, true);
    data = Object.entries(data).map((e)=>{
      return encodeURIComponent(e[0])+"="+encodeURIComponent(e[1]);
    }).join('&');
    console.log(data);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);

  }


}
