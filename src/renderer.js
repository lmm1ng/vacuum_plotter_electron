import {parseText, renderChart, generateCsv} from './functions'

const fileInput = document.querySelector('#uploader')
const stepInput = document.querySelector('#step-input')

const renderButton = document.querySelector('#render-button')
const downloadButton = document.querySelector('#download-button')

const errorText = document.querySelector('#error-text')

const scaleSelector = document.querySelector('#scale-select')

let chartCanvas = document.querySelector('#chart')
const chartWrapper = document.querySelector('#chart-wrapper')

let downloadFile = null

fileInput.oninput = onFileInput
renderButton.onclick = onRenderClick
downloadButton.onclick = onDownloadClick
stepInput.oninput = onStepInput

function onRenderClick() {
  errorText.style.display = 'none'
  downloadButton.disabled = true
  downloadFile = null
  resetCanvas(chartCanvas)
  parseText(fileInput.files[0])
    .then(([detector1, detector2]) => {
      try {
        const out = renderChart(chartCanvas, detector1, detector2, Number(stepInput.value), scaleSelector.value)
        downloadFile = generateCsv(out)
        downloadButton.disabled = false
      } catch (e) {
        console.log(e)
        errorText.style.display = 'inline'
      }
      fileInput.value = ''
      stepInput.value = ''
      renderButton.disabled = true
    })
}

function onDownloadClick() {
  const link = document.createElement('a')
  link.setAttribute('href', downloadFile)
  link.setAttribute('download', 'out.csv')
  document.body.appendChild(link)

  link.click()
}

function onFileInput(event) {
  if (event.target.value && stepInput.value) {
    renderButton.disabled = false
  }
}

function onStepInput(event) {
  if (event.target.value && fileInput.value) {
    renderButton.disabled = false
  }
}

function resetCanvas(canvas) {
  canvas.remove()
  const newCanvas = document.createElement('canvas')
  newCanvas.id = 'chart'
  chartWrapper.append(newCanvas)
  chartCanvas = newCanvas
}
