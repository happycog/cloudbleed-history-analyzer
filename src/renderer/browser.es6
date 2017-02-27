const {ipcRenderer} = require('electron');
const React = require('react');
import ReactDOM from 'react-dom'

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
