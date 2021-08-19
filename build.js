const fs = require('fs');
const cp = require('child_process');
const http = require('http');
const proxyServerIp = '192.168.1.12';

function findFileOfType(dir, type){
  let files = fs.readdirSync(dir);
  for(var i = 0; i < files.length; i++){
    if(files[i].endsWith(type))return dir+'/'+files[i];
  }
}

function send(name, path){
  let stat = fs.statSync(path);
  let req = http.request({hostname: proxyServerIp, port: 9090, path: "/"+name, method: "post", headers: {'Content-Length': stat.size}});
  let stream = fs.createReadStream(path);
  stream.pipe(req);
}

function rmDir(dir){
  try{
    let stat = fs.statSync(dir);
    if(stat.isDirectory()){
      let files = fs.readdirSync(dir);
      for(var i = 0; i < files.length; i++){
        rmDir(dir+'/'+files[i]);
      }
      fs.rmdirSync(dir);
    }else{
      fs.unlinkSync(dir);
    }
  }catch(e){}
}

console.log("Making IShelterWrapper...");
console.log("Deleting existing build directory...");
rmDir('build');
console.log("Running 'npm run build', This may take some time...");
cp.execFileSync('npm', ['run', 'build']);
console.log("Attempting to patch proxy server on '"+proxyServerIp+"'...");
let script = findFileOfType('build/static/js', '.js');
send('script', script);
send('style', findFileOfType('build/static/css', '.css'));
//http.request()
