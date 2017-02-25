const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const promise = require('bluebird');
const request = require('request');

promise.promisifyAll(require("request"));

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

let initApp = () => {

    let dbSourcePath = ( () => {
        if (process.platform === 'darwin') {
            let profileDirs = ['Default', 'Profile 1'];
            for (var i = 0; i < profileDirs.length; i++) {
                let path = process.env.HOME + '/Library/Application Support/Google/Chrome/'+profileDirs[i]+'/History';
                if (fs.existsSync(path)) {
                    return path;
                }
            }
            return '';
        } else {
            // todo
            return '';
        }
    })();

    let dbTempPath = '/tmp/Chrome_history';

    var copyDb = () => {
        return new promise( (resolve, reject) => {
            if (dbSourcePath==='') {
                reject('Chrome history could not be found.');
            }
            var copy = fs.createReadStream(dbSourcePath).pipe(fs.createWriteStream(dbTempPath));
            copy.on('finish', () => {
                resolve();
            });
        });
    };

    var readDb = () => {
        return new promise( (resolve, reject) => {
            var db = new sqlite3.Database(dbTempPath);
            db.serialize(() => {
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
    };

    var isHostUsingCloudFlare = (url) => {
        return request.getAsync({
            method: 'head',
            url: url,
            timeout: 5000,
        })
        .then(function(response) {
            return Object.keys(response.headers).indexOf('cf-ray') !== -1 ? true : false;
        })
        .catch(function(err) {
        });
    };

    var parseHistoryForUniqueHostnames = (rows) => {
        let hostnames = [];
        var hostChecks = [];
        return new promise((resolve, reject) => {
            for (var i = 0; i < rows.length; i++) {
                var hostname = url.parse(rows[i].url).hostname;
                if (hostnames.indexOf(hostname)===-1) {
                    hostnames.push(hostname);
                    hostChecks.push('http://' + hostname);
                    hostChecks.push('https://' + hostname);
                }
                // if (i===500) break;
            }
            resolve(hostChecks);
        });
    };

    var determineCloudFlareHosts = (hostChecks) => {
        let numberOfHostsToCheck = hostChecks.length;
        let completed = 0;
        this.cloudFlareHosts = [];
        return promise.map(hostChecks, (host) => {
            completed++;
            percentComplete = (completed) / numberOfHostsToCheck;
            win.webContents.send('updateCounter', percentComplete);
            return isHostUsingCloudFlare(host).then((isCloudFlare) => {
                if (isCloudFlare) {
                    let report = url.parse(host).hostname;
                    if (this.cloudFlareHosts.indexOf(report)===-1) {
                        this.cloudFlareHosts.push(report);
                    }
                }
                Promise.resolve();
            });
        }, { concurrency: 100 });
    };

    var reportToRenderer = () => {
        this.cloudFlareHosts.sort();
        return new Promise((resolve, reject) => {
            win.webContents.send('reportHosts', this.cloudFlareHosts);
        });
    };

    var clerTempDb = () => {
        return new promise(function( resolve, reject) {
            fs.unlink(dbTempPath, function(err) {
                resolve();
            });
        });
    };

    copyDb()
        .bind({})
        .then(readDb)
        .then(parseHistoryForUniqueHostnames)
        .then(determineCloudFlareHosts)
        .then(reportToRenderer)
        .then(clerTempDb)
        .catch((err) => {
            win.webContents.send('displayMsg', err);
        });
};

let createWindow = () => {
  // Create the browser window.
  win = new BrowserWindow({width: 750, height: 600});

  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('ready', initApp);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
