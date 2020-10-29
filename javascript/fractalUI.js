function increaseZoom(){
  config.zoomLevel++;
  config.xMin *= 0.5;
  config.yMin *= 0.5;
  fractalStart();
}

function decreaseZoom(){
  if (config.zoomLevel === 1){ return false }
  config.zoomLevel--;
  config.xMin *= 2;
  config.yMin *= 2;
  fractalStart();
}

function scrollToLeft(){
  config.xMin -= 0.5;
  fractalStart();
}

function scrollToRight(){
  config.xMin += 0.5;
  fractalStart();
}

function scrollUp(){
  config.yMin -= 0.5;
  fractalStart();
}

function scrollDown(){
  config.yMin += 0.5;
  fractalStart();
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
  coordInfo = document.getElementById('coordinates');
  x = e.pageX - e.target.offsetLeft;
  y = e.pageY - e.target.offsetTop;
  coordInfo.innerHTML = '(' + x + ',' + y + ')';

}

function changeConstant(){
  config.constantReal = document.getElementById('constantReal').value;
  config.constantImag = document.getElementById('constantImag').value;
  document.getElementById('constantValue').innerHTML = config.constantReal + ' + ' + config.constantImag + 'i';
  fractalStart();
}

function changeIndices(){
  config.indices = document.getElementById('indices').value;
  document.getElementById('indicesValue').innerHTML = config.indices;
  fractalStart();
}

function resetNumberSettings(){
  document.getElementById('constantReal').value = 0;
  document.getElementById('constantImag').value = 0;
  document.getElementById('indices').value = 2;
  changeConstant();
  changeIndices();
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
