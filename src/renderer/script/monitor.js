const {ipcRenderer} = require('electron')
const os = require('os')
const Chart = require('chart.js')
// window.$ = window.jQuery = require('jquery');

var chart = null;
var lastMeasureTimes = [];

// Initialize/Start monitor only after the window is ready to show (-> call this via IPC)
ipcRenderer.on('init-monitor', (flag) => {
    console.log('Received init-monitor via ipcRenderer')

    document.getElementById('info').innerText =
        'Host: ' + os.hostname() +
        ', Platform: ' + os.platform() +
        ', CPU Arch: ' + os.arch() +
        ', Cores: ' + os.cpus().length +
        ', Memory: ' + Math.round(os.totalmem() / 1024 / 1024 / 1024, 2) + ' GB'

    setLastMeasureTimes(os.cpus());
    drawChart()
})

function setLastMeasureTimes(cpus) {
    for (let i = 0; i < cpus.length; i++) {
        lastMeasureTimes[i] = getCpuTimes(cpus[i]);
    }
}

function getDatasets() {
    const datasets = []
    const cpus = os.cpus()

    for (let i = 0; i < cpus.length; i++) {
        const cpu = cpus[i]
        const cpuData = {
            data: getCpuTimes(cpu),
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)'
            ]
        }
        datasets.push(cpuData)
    }
    testCpus = os.cpus();
    return datasets;
}

function updateDatasets() {
    const cpus = os.cpus()
    for (let i = 0; i < cpus.length; i++) {
        const cpu = cpus[i]
        chart.data.datasets[i].data = getCpuTimes(cpu);
        chart.data.datasets[i].data[0] -= lastMeasureTimes[i][0];
        chart.data.datasets[i].data[1] -= lastMeasureTimes[i][1];
        chart.data.datasets[i].data[2] -= lastMeasureTimes[i][2];
    }
    chart.update();
    setLastMeasureTimes(cpus);
}

function getCpuTimes(cpu) {
    return [
        cpu.times.user,
        cpu.times.sys,
        cpu.times.idle,
    ];
}

function drawChart() {
    // chart = chartjs({
    // chart = new Chart($('.chart'), {
    var ctx = document.getElementById("monitor-chart").getContext("2d");
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                'User Time (ms)',
                'System Time (ms)',
                'Idle Time (ms)'
            ],
            datasets: getDatasets()
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'CPU Activity',
                fontColor: 'rgb(250, 250, 250)',
                fontSize: 16
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(250, 250, 250)',
                    fontSize: 12
                }
            }
        }
    });

    setInterval(updateDatasets, 1000);
}
