const iterations = 50;
const multiplier = 1000000000;

const debug = true

let high_level = 10
let low_level = 10
let seq = "1010101";
let ntuChart = null;
let ntuInter = null;

//==============================================


function isEmpty(property) {
    return (property === null || property === "" || typeof property === "undefined");
}

function runTest() {
    ntuInter = setInterval(function () {
        let lastValue = ntuChart.data.labels.slice(-1).pop()

        addData(ntuChart, lastValue + 1, getRandomInt(1, 50))
    }, 100);
}

function stopTest() {
    if (ntuInter) {
        clearInterval(ntuInter);
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
        dataset.data.shift();
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

var options = {
    responsive: true,
    scales: {
        xAxes: [{
            display: true,
            scaleLabel: {
                display: true,
                fontSize: 14,
                fontStyle: 'bold',
                labelString: 'Time'
            },
            ticks: {
                fontSize: 14,
            }
        }],
        yAxes: [{
            display: true,
            ticks: {
                fontSize: 14,
            },
            scaleLabel: {
                display: true,
                fontSize: 14,
                fontStyle: 'bold',
                labelString: 'CPU Processing Time (%)'
            }
        }]
    }
};
let st = {
    backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ],
    borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ],
    borderWidth: 1
}

function initChart() {

    let ctx = $("#ntuChart").get(0).getContext('2d');
    let initLabelAndData = []
    for (let i = 0; i < 100; i++) {
        initLabelAndData.push(i)
    }

    ntuChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: initLabelAndData,
            datasets: [{
                label: 'Time (sec.)',
                data: initLabelAndData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: options
    });
}


$(function () {
    initChart()
    $("#ntu-starter").on("click", function () {
        runTest();
    });
    $("#ntu-stopper").on("click", function () {
        stopTest();
    });
    $("#ntu-cleaner").on("click", function () {
        removeData(ntuChart)
    });
});
