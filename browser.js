const {ipcRenderer} = require('electron');
const ProgressBar = require('progressbar.js');
const _ = require('underscore');

class Status {
    constructor(domEl, totalCount) {
        this.domEl = domEl;
        this.totalCount = totalCount;
        this.init();
    }
    init() {
        this.bar = new ProgressBar.SemiCircle(this.domEl, {
            strokeWidth: 6,
            color: '#FFEA82',
            trailColor: '#eee',
            trailWidth: 1,
            easing: 'easeInOut',
            duration: 1400,
            svgStyle: null,
            text: {
                value: '',
                alignToBottom: false
            },
            from: {color: '#FFEA82'},
            to: {color: '#ED6A5A'},
            step: (state, bar) => {
                bar.path.setAttribute('stroke', state.color);
                var value = Math.round(bar.value() * 100);
                if (value === 0) {
                    bar.setText('');
                } else {
                    bar.setText(value);
                }
                bar.text.style.color = state.color;
            }
        });
    }
    update(newVal) {
        this.bar.animate(newVal);
    }
}

let currentStatus;
let initCounter = (totalCount) => {
    currentStatus = new Status('#progress', totalCount);
};

initCounter();

let msg = document.getElementById('msg');
ipcRenderer.on('displayMsg', function(event, msgText) {
    msg.appendChild(document.createTextNode(msgText));
});

ipcRenderer.on('updateCounter', function(event, count) {
    currentStatus.update(count);
});

let report = document.getElementById('report');
ipcRenderer.on('reportHosts', function(event, hosts) {
    _(hosts).each((host) => {
        let el = document.createElement('li');
        el.appendChild(document.createTextNode(host));
        report.appendChild(el);
    });
});

