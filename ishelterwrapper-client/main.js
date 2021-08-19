const {app, BrowserWindow} = require('electron');
const Store = require('electron-store');

Store.initRenderer()
app.on('ready', ()=>{
  window = new BrowserWindow({width:800, height:600, webPreferences: {
    preload: __dirname+'/app/preload/index.js'}
  });
  window.loadURL('file:///'+__dirname+'/app/index.html');
  window.on('closed', ()=>{
    window = null;
  });
});

app.on('window-all-closed', ()=>{
  app.quit();
})
