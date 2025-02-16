const { contextBridge, ipcRenderer } = require("electron");

let validChannels = [
  "open_browser","error","save_submission_json","create_submission_xml"
];

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, function (event, args) {
        console.log([channel,event,args]);
        func(channel, event, args);
      });
    }
  }
});


var pjson = require('./package.json');
localStorage.setItem('version',pjson.version);