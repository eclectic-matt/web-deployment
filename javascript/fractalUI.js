function increaseZoom(){
  config.zoomLevel++;
  //config.xMin *= 0.5;
  //config.yMin *= 0.5;
  fractalStart();
}

function decreaseZoom(){
  if (config.zoomLevel === 1){ return false }
  config.zoomLevel--;
  //config.xMin *= 2;
  //config.yMin *= 2;
  fractalStart();
}

function scrollToLeft(){
  // CALCULATE THE RANGE OF VALUES
  let xRange = RANGE / config.zoomLevel;
  config.xCenter -= (xRange / 4);
  fractalStart();
  updateCenterCoords();
}

function scrollToRight(){
  let xRange = RANGE / config.zoomLevel;
  config.xCenter += (xRange / 4);
  fractalStart();
  updateCenterCoords();
}

function scrollUp(){
  let yRange = RANGE / config.zoomLevel;
  config.yCenter -= (yRange / 4);
  fractalStart();
  updateCenterCoords();
}

function scrollDown(){
  let yRange = RANGE / config.zoomLevel;
  config.yCenter += (yRange / 4);
  fractalStart();
  updateCenterCoords();
}

function changeIterations(){
  // REGISTER A CHANGE IN THE ITERATIONS
  config.maxIterations = document.getElementById('iterations').value;
  fractalStart();
}

function changeColourScheme(){
  // REGISTER A CHANGE IN THE COLOUR SCHEME
  config.colourScheme = document.getElementById('colourScheme').value;
  if (config.colourScheme === 'Random'){
    config.randomCols = getRandomColourScheme();
  }
  fractalStart();
}

function changeFractalType(){
  config.fractalType = document.getElementById('fractalType').value;
  fractalStart();
}

function updateCoords(e){
  let coordInfo = document.getElementById('coordinates');
  x = e.pageX - e.target.offsetLeft;
  y = e.pageY - e.target.offsetTop;
  coordInfo.innerHTML = '(' + x + ',' + y + ')';
}

function updateCenterCoords(){
  let centerInfo = document.getElementById('centerCoords');
  centerInfo.innerHTML = config.xCenter.toFixed(2) + ', ' + config.yCenter.toFixed(2);
}

function changeConstant(){
  config.constantReal = document.getElementById('constantReal').value;
  config.constantImag = document.getElementById('constantImag').value;
  document.getElementById('constantValue').innerHTML = config.constantReal + ' + ' + config.constantImag + 'i';
  fractalStart();
}

function changeExponent(){
  config.exponent = document.getElementById('exponent').value;
  document.getElementById('exponentValue').innerHTML = config.exponent;
  fractalStart();
}

function resetNumberSettings(){
  document.getElementById('constantReal').value = 0;
  document.getElementById('constantImag').value = 0;
  document.getElementById('indices').value = 2;
  changeConstant();
  changeIndices();
}

function resetView(){
  config.xCenter = 0;
  config.yCenter = 0;
  config.zoomLevel = 1;
  fractalStart();
}

function downloadImage(){

  // Based on https://stackoverflow.com/a/54869638
  var image = document.getElementById('fractalCnv').toDataURL("image/png", 1.0);
  var a = document.createElement('a');
  a.href = image;
  a.download = 'fractal_Z^' + config.indices + '_C=' + config.constantReal + '+' + config.constantImag + 'i.png';
  document.body.appendChild(a);
  a.click();

}
