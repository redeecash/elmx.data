"use strict"

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let tray = null;

function createWindow () {

    mainWindow = new BrowserWindow({
        width: 1072,
        height: 910,
        title: "Exempt Liquidity Market Exchange Reporting",
        icon: 'assets/logo.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('views/index.html');


    mainWindow.on('closed', function () {
        mainWindow = null
    });

    mainWindow.setMenu(null);

    mainWindow.once('ready-to-show', () => {
        //autoUpdater.checkForUpdatesAndNotify();
    });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

// IPC communication between view and node
ipcMain.on('error', function(evt, data){
    console.log(data);
    mainWindow.webContents.send('error',data);
});

ipcMain.on('open_browser', function(evt, url){
    var start = (process.platform == 'darwin'? 'open': process.platform == 'win32'? 'start': 'xdg-open');
    require('child_process').exec(start + ' ' + url);
    mainWindow.webContents.send('open_browser','success');
});

ipcMain.on('save_submission_json', function(evt, json){
    var now = new Date().toISOString().substring(0,23);
    var filename = `submission_${now}.json`;
    filename = filename.replace(':','_');
    fs.writeFileSync(filename,json);

    var results = {
        fileName: filename,
        contents: JSON.parse(json),
        created: now
    };
    mainWindow.webContents.send('save_submission_json',results);
});
  
ipcMain.on('create_submission_xml', function(evt,data){
    const form = data.form;
    const cik = data.cik;
    const now = data.date;
    const json = data.json;
    const jsonxml = require('jsontoxml');
    const pkg = require('./package.json');
    var comment = `<?xml version="1.0"?><!-- Created using https://github.com/redeecash/exchange.data version ${pkg.version} -->`;
    var xml = comment + jsonxml(json);
    var filename = `submission_${cik}_${form}_${now}.xml`;
    filename = filename.replace(':','_');
    fs.writeFileSync(filename,xml);
    var results = {
        fileName: filename,
        contents: comment + xml,
        form: form,
        created: now
    };
    mainWindow.webContents.send('create_submission_xml',results);
});