function increaseZoom(){
  zoomLevel++;
  xMin *= 0.5;
  yMin *= 0.5;
  fractalStart();
}

function decreaseZoom(){
  if (zoomLevel === 1){ return false }
  zoomLevel--;
  xMin *= 2;
  yMin *= 2;
  fractalStart();
}

function scrollToLeft(){
  xMin -= 0.5;
  fractalStart();
}

function scrollRight(){
  xMin += 0.5;
  fractalStart();
}

function scrollUp(){
  yMin -= 0.5;
  fractalStart();
}

function scrollDown(){
  yMin += 0.5;
  fractalStart();
}

function changeIterations(){
  // REGISTER A CHANGE IN THE ITERATIONS
  maxIterations = document.getElementById('iterations').value;
  fractalStart();
}

function changeColourScheme(){
  // REGISTER A CHANGE IN THE COLOUR SCHEME
  colourScheme = document.getElementById('colourScheme').value;
  if (colourScheme === 'Random'){
    randomCols = getRandomColourScheme();
  }
  fractalStart();
}

function changeFractalType(){
  fractalType = document.getElementById('fractalType').value;
  fractalStart();
}
