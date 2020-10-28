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

function scrollRight(){
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
