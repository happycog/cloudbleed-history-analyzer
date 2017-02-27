import React from 'react';
import {ipcRenderer} from 'electron';

import ReportRow from './ReportRow'

class Report extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.initIpcListener();
    }

    initIpcListener() {
        ipcRenderer.on('reportHosts', (event, hosts) => {
            this.setState({
                data: hosts
            });
        });
    }

    render() {
        if (this.state.data.length === 0)
            return null;

        return (
            <div>
                <hr />
                <h3>Sites you have visited that use CloudFlare:</h3>
                <p>If you have an account with any of these sites, you should change your password.</p>
                <table className="table-striped">
                  <tbody>
                    {this.buildChildren()}
                  </tbody>
                </table>
            </div>
        )
    }

    buildChildren(data) {
        return this.state.data.map((child, idx)=>{
            return <ReportRow key={idx} content={child} />
        });
    }

}

export default Report;
