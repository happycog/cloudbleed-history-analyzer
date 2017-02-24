const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const sqlite3 = require('sqlite3');
const fs = require('fs');
const Promise = require('bluebird');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 400, height: 400})

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let dbSourcePath = (function() {
    if (process.platform === 'darwin') {
        return process.env.HOME + '/Library/Application Support/Google/Chrome/Default/History';
    } else {
        // todo
        return '';
    }
})();

let dbTempPath = '/tmp/Chrome_history';

var copyDb = function() {
    return new Promise(function(resolve, reject) {
        var copy = fs.createReadStream(dbSourcePath).pipe(fs.createWriteStream(dbTempPath));
        copy.on('finish', function() {
            resolve();
        });
    });
}

var readDb = function() {
    return new Promise(function(resolve, reject) {
        var db = new sqlite3.Database(dbTempPath);
        db.serialize(function() {
            db.all("SELECT DISTINCT(url) FROM urls;", function(err, rows) {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        db.close();
    });
}

var parseDbRows = function(rows) {
    let hostnames = [];
    return new Promise(function(resolve, reject) {
        for (var i = 0; i < rows.length; i++) {
            var hostname = url.parse(rows[i].url).hostname;
            if (hostnames.indexOf(hostname)===-1) hostnames.push(hostname);
        }
        console.log(hostnames);
        resolve(hostnames);
    });
}

var clerTempDb = function() {
    return new Promise(function(resolve, reject) {
        fs.unlink(dbTempPath, function(err) {
            resolve();
        });
    });
}

copyDb()
    .then(readDb)
    .then(parseDbRows)
    .then(clerTempDb);
