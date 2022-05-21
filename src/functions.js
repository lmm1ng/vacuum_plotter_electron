import {linearInterpolation} from 'simple-linear-interpolation'
import {Chart} from 'chart.js'

export function parseText(file) {
  return new Promise((resolve, reject) => {
    let result = ''
    const reader = new FileReader()
    reader.onloadend = (event) => {
      const detector1 = []
      const detector2 = []
      result = event.target.result.split('\n')
      for (let i = 0; i < result.length - 1; i++) {
        const arr = result[i].split(' ').filter(el => el)
        const time = Number(arr[0])
        const d1Voltage = Number(arr[1])
        const d2Voltage = Number(arr[2])
        if (arr.length !== 3 || !time || !d1Voltage || !d2Voltage) {
          continue
        }
        detector1.push({
          x: time,
          y: d1Voltage,
        });
        detector2.push({
          x: time,
          y: d2Voltage,
        });
      }
      resolve([detector1, detector2])
    };
    reader.onerror = (err) => {
      reject(err)
    };
    reader.readAsText(file)
  });
}

export function renderChart(canvas, detector1, detector2, step, scale) {
  const calculateD1 = linearInterpolation(detector1)
  const calculateD2 = linearInterpolation(detector2)
  const x = []
  const d1Scaled = []
  const d2Scaled = []
  const y1 = []
  const y2 = []
  for (let i = 0; i < detector1[detector1.length - 1].x - 1; i += step) {
    x.push(i)
    d1Scaled.push(calculateD1({x: i}))
    y1.push(getPresuareFromVoltage(calculateD1({x: i})))
  }
  for (let i = 0; i < detector2[detector2.length - 1].x - 1; i += step) {
    d2Scaled.push(calculateD2({x: i}))
    y2.push(getPresuareFromVoltage(calculateD2({x: i})))
  }
  const myChart = new Chart(canvas.getContext('2d'), {
    type: 'line',
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          type: scale,
          title: {
            text: 'Давление, Па',
            display: true
          }
        },
        x: {
          title: {
            text: 'Время, с',
            display: true
          }
        }
      },
    },
    data: {
      labels: x,
      datasets: [
        {
          label: 'Датчик 1',
          borderColor: 'red',
          fill: false,
          pointRadius: 1,
          data: y1,
        },
        {
          label: 'Датчик 2',
          borderColor: 'blue',
          fill: false,
          pointRadius: 1,
          data: y2,
        },
      ],
    },
  })
  return [x, d1Scaled, d2Scaled, y1, y2]
}

function getPresuareFromVoltage(v) {
  const data = [
    {x: 0.01, y: 0.12},
    {x: 0.33, y: 0.2},
    {x: 0.56, y: 0.3},
    {x: 0.7, y: 0.379},
    {x: 0.8, y: 0.461},
    {x: 0.9, y: 0.578},
    {x: 0.982, y: 0.7},
    {x: 1, y: 0.729},
    {x: 1.2, y: 1.4},
    {x: 1.5, y: 3.25},
    {x: 1.6, y: 3.99},
    {x: 1.8, y: 5.97},
    {x: 2, y: 8.46},
    {x: 2.11, y: 10},
    {x: 2.6, y: 20.4},
    {x: 3, y: 31.5},
    {x: 3.25, y: 40},
    {x: 4, y: 79},
    {x: 5, y: 163},
    {x: 6, y: 302},
    {x: 7, y: 540},
    {x: 8, y: 1020},
    {x: 8.5, y: 1400},
    {x: 9, y: 2340},
    {x: 9.22, y: 3080},
    {x: 9.36, y: 3890},
    {x: 9.5, y: 5525},
    {x: 9.55, y: 6320},
    {x: 9.6, y: 7430},
    {x: 9.65, y: 9000},
    {x: 9.7, y: 11220},
    {x: 9.75, y: 14330},
    {x: 9.8, y: 18800},
    {x: 9.85, y: 25600},
    {x: 9.9, y: 37350},
    {x: 9.935, y: 50180},
    {x: 9.95, y: 57000},
    {x: 10, y: 98400},
  ]
  const calculate = linearInterpolation(data)
  return calculate({x: v})
}

export function generateCsv(data) {
  const rows = []
  for (let i = 0; i < data[0].length; i++) {
    rows.push(data.map(el => el[i]))
  }
  return encodeURI('data:text/csv;charset=utf-8,' +
    rows.map(e => e.map(number => String(number).replace('.', ',')).join(';'))
      .join("\n"))
}
