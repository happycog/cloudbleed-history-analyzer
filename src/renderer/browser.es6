// require('babel-register');
const {ipcRenderer} = require('electron');
const React = require('react');
import ReactDOM from 'react-dom'
const electronOpenLinkInBrowser = require("electron-open-link-in-browser");

import BeginBtn from './BeginBtn';
import Status from './Status';
import Report from './Report';

let beginFunc = () => {
    ipcRenderer.send('begin');
}

ReactDOM.render(
    (
        <div>
            <BeginBtn beginFunc={beginFunc} />
            <Status />
            <Report />
        </div>
    ), document.getElementById('app')
);

// let currentStatus;
// let initCounter = (totalCount) => {
//     currentStatus = new Status('#progress', totalCount);
// };

// let msg = document.getElementById('msg');
// ipcRenderer.on('displayMsg', function(event, msgText) {
//     msg.appendChild(document.createTextNode(msgText));
// });


// let report = document.getElementById('report');
// ipcRenderer.on('reportHosts', function(event, hosts) {
//     hosts.forEach((host) => {
//         let elTr = document.createElement('tr');
//         let elTd = document.createElement('td');
//         elTd.appendChild(document.createTextNode(host));
//         elTr.appendChild(elTd);
//         report.appendChild(elTr);
//     });
// });

// let beginBtn = document.getElementById('beginBtn');
// beginBtn.addEventListener('click', function(event) {
//     ipcRenderer.send('begin');
//     initCounter();
// });
