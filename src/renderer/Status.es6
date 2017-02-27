const React = require('react');
const ProgressBar = require('progressbar.js');
const {ipcRenderer} = require('electron');

class Status extends React.Component {

    constructor(props) {
        super(props);

        let initialized = false;

        this.state = { isVisible: true };

        // listen for progress updates from the main process
        ipcRenderer.on('updateCounter', (event, newVal) => {
            if (initialized===false) {
                this.renderBar();
                initialized = true;
            }
            this.update(newVal);
        });

        // once we have the report, hide this component
        ipcRenderer.on('reportHosts', (event, hosts) => {
            this.setState({
                isVisible: false
            });
        });
    }

    render() {
        return this.state.isVisible ? (
            <div id="progress" />
        ) : null;
    }

    renderBar() {
        this.bar = new ProgressBar.Line('#progress', {
            strokeWidth: 4,
            color: '#1A9FDD',
            trailColor: '#eee',
            trailWidth: 1,
            easing: 'easeInOut',
            duration: 1400,
            svgStyle: null,
            text: {
                value: '',
                alignToBottom: false,
                style: {
                    top: '30px'
                }
            },
            step: (state, bar) => {
                var value = Math.round(bar.value() * 100);
                if (value === 0) {
                    bar.setText('0%');
                } else if (value === 100) {
                    bar.setText('Done! Generating report...');
                } else {
                    bar.setText(value + '%');
                }
            }
        });
    }

    update(newVal) {
        this.bar.animate(newVal);
    }

}

export default Status;
