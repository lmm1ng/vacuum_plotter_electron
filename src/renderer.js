import { parseText, renderChart } from './functions';

const fileInput = document.querySelector('#uploader');
const stepInput = document.querySelector('#step-input');

const renderButton = document.querySelector('#render-button');

const errorText = document.querySelector('#error-text');

let chartCanvas = document.querySelector('#chart');
const chartWrapper = document.querySelector('#chart-wrapper');

fileInput.oninput = onFileInput;
renderButton.onclick = onButtonClick;
stepInput.oninput = onStepInput;

function onButtonClick() {
  errorText.style.display = 'none';
  resetCanvas(chartCanvas);
  parseText(fileInput.files[0])
    .then(([detector1, detector2]) => {
      try {
        renderChart(chartCanvas, detector1, detector2, Number(stepInput.value));
      } catch (e) {
        console.log(e);
        errorText.style.display = 'inline';
      }
      fileInput.value = '';
      stepInput.value = '';
      renderButton.disabled = true;
    });
}

function onFileInput(event) {
  if (event.target.value && stepInput.value) {
    renderButton.disabled = false;
  }
}

function onStepInput(event) {
  if (event.target.value && fileInput.value) {
    renderButton.disabled = false;
  }
}

function resetCanvas(canvas) {
  canvas.remove();
  const newCanvas = document.createElement('canvas');
  newCanvas.id = 'chart';
  chartWrapper.append(newCanvas);
  chartCanvas = newCanvas;
}
