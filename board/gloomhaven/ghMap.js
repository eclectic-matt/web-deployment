const COL_LIGHT = "white";
const COL_HIGHLIGHT = "yellow";
const COL_DARK = "black";
const ICON_FONT = "28px Arial";
const COL_COPPERNECK = "#ff9900";
const COL_DAGGER = "#a0f58e";
const COL_MISTY = "#45dbdb";
const COL_WATCHER = "#ff6666";
const COL_GLOOMHAVEN = "#8868cc";
const COL_CRYPTS = "#858787";
const COL_LINGERING = "#5e9d03";

const MAP_RATIO = 1.32;
// const MAP_PADDING = 100;
const MAP_PADDING = 1;

const MODAL_DIV_ID = 'modalDiv';
const MODAL_SCENARIO_NUM_SPAN = 'modalScenarioNum';
const MODAL_SCENARIO_NAME_SPAN = 'modalScenarioName';
const MODAL_SCENARIO_TABLE = 'modalDataTable';

const MODAL_TABLE_GRIDREF = 'modalTableGridRef';
const MODAL_TABLE_REGION = 'modalTableRegion';
const MODAL_TABLE_UNLOCKED = 'modalTableUnlocked';
const MODAL_TABLE_LOCKED = 'modalTableLocked';
const MODAL_TABLE_COMPLETED = 'modalTableCompleted';

/*
** GH-Map.png
Full size:   1873 x 1414
25% smaller: 1405 x 1061
50% smaller: 937	 x 707
75% smaller: 468	 x 354

https://photos.google.com/u/0/search/paper/photo/AF1QipOweH5osFP5HCMZqCxaYQheepHpHS3yBzbR1nl6
*/


var mapObj, xScale, yScale = 0;

function getMapData(){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      mapObj = JSON.parse(xhttp.responseText);
      generateGHmap(mapObj);
    }
  };
  xhttp.open("GET", "./ghData-v3.json", true);
  xhttp.send();
}


function generateGHmap(mapObj){

    resizeWindow();

    populateScenarioLists(mapObj);

    var canvas = document.querySelector('canvas');

    canvas.addEventListener('click', canvasClick);

    window.addEventListener('resize', resizeWindow);

}


function showModal(p, x, y, rect, e = {}){
  var modal = document.getElementById(MODAL_DIV_ID);
  //Forcing this in to allow CSS animations
  modal.classList.remove('w3-show');
  void modal.offsetWidth;
  modal.classList.add('w3-hide');
  modal.classList.remove('w3-hide');
  modal.classList.add('w3-show');
  var w = 250; //parseInt(modal.width.replaceAll('px', ''));
  var h = 200; //parseInt(modal.height.replaceAll('px', ''));
  // UPDATE MODAL HEADING
  if ( (p.unlocked === true) || (p.completed === true) ){
    document.getElementById(MODAL_SCENARIO_NUM_SPAN).innerHTML = p.scenario;
    document.getElementById(MODAL_SCENARIO_NAME_SPAN).innerHTML = p.name;
  }else{
    document.getElementById(MODAL_SCENARIO_NUM_SPAN).innerHTML = p.scenario;
    document.getElementById(MODAL_SCENARIO_NAME_SPAN).innerHTML = '[spoilers]';
  }
  // UPDATE MODAL TABLE
  document.getElementById(MODAL_TABLE_GRIDREF).innerHTML = p.grid;
  document.getElementById(MODAL_TABLE_REGION).innerHTML = p.region;
  document.getElementById(MODAL_TABLE_UNLOCKED).innerHTML = p.unlocked;
  document.getElementById(MODAL_TABLE_LOCKED).innerHTML = p.locked;
  document.getElementById(MODAL_TABLE_COMPLETED).innerHTML = p.completed;
  // UPDATE MODAL CSS
  //CHANGE - CHECK FOR LEFT/TOP/RIGHT SCREEN CLIPPING

  // IF x IS TOO CLOSE TO THE EDGES
  if ( (x < w) || ( (x + w) > mapObj.mapInfo.scaledWidth) ){
    //DRAW IN THE CENTER OF THE MAP
    //modal.style.left = Math.floor( rect.left + (mapObj.mapInfo.scaledWidth / 2) - (w / 2) ) + 'px';
    modal.style.left = Math.floor( window.pageXOffset + (mapObj.mapInfo.scaledWidth / 2) - (w / 2) ) + 'px';
  }else{
    //modal.style.left = Math.floor( rect.left + (x - (w / 2) ) ) + 'px';
    modal.style.left = Math.floor( window.pageXOffset + (x - (w / 2) ) ) + 'px';
  }

  // IF y IS TOO CLOSE TO THE EDGES
  if ( (y < h) || ( (y + h) > mapObj.mapInfo.scaledHeight) ){
    //modal.style.top = Math.floor( rect.top + (mapObj.mapInfo.scaledHeight / 2) - (h / 2) ) + 'px';
    modal.style.top = Math.floor( window.pageYOffset + (mapObj.mapInfo.scaledHeight / 2) - (h / 2) ) + 'px';
  }else{
    //modal.style.top = Math.floor( rect.top + y - h ) + 'px';
    modal.style.top = Math.floor( window.pageYOffset + y - h ) + 'px';
  }

  console.log(rect, e.screenX, e.screenY, modal.style.top, modal.style.left);

  /*if ( rect.top > Math.floor((rect.top + y) - 75) ){
    //MODAL WOULD DRAW ABOVE MAP VIEW
    console.log('modal clip top');
    modal.style.top = Math.floor((rect.bottom - y) - 75) + 'px';
  }else{
    modal.style.top = Math.floor((rect.top + y) - 75) + 'px';
  }
  if ( rect.left > Math.floor(rect.left + (x - (w / 2)) ) ){
    //MODAL WOULD DRAW TO THE LEFT OF THE MAP VIEW
    console.log('modal clip left');
    modal.style.left = Math.floor(rect.right - (x - (w / 2)) ) + 'px';
  }else{
    modal.style.left = Math.floor(rect.left + (x - (w / 2)) ) + 'px';
  }*/


}

function hideModal(){
  console.log('hiding modal');
  var modal = document.getElementById(MODAL_DIV_ID);
  modal.classList.remove('w3-show');
  modal.classList.add('w3-hide');
}

function getScenarioInfo(id){
  p = mapObj.scenarioInfo[(id - 1)];
  return p;
}


function resizeWindow(){

  //Update the mapObj scaleW/scaleH
  if (window.innerHeight > window.innerWidth){
    //PORTRAIT - width as deciding factor
    mapObj.mapInfo.scaledWidth = Math.floor(window.innerWidth - (MAP_PADDING - (window.innerWidth / mapObj.mapInfo.fullWidth) ) );
    mapObj.mapInfo.scaledHeight = Math.floor((window.innerWidth - (MAP_PADDING - (window.innerWidth / mapObj.mapInfo.fullWidth) )) / MAP_RATIO);    
    //console.log('Portrait',mapObj.mapInfo.scaledWidth, mapObj.mapInfo.scaledHeight);
  }else{
    //LANDSCAPE - height as deciding factor
    mapObj.mapInfo.scaledHeight = Math.floor((window.innerHeight - (MAP_PADDING - (window.innerHeight / mapObj.mapInfo.fullHeight) )));  
    mapObj.mapInfo.scaledWidth = Math.floor((window.innerHeight - (MAP_PADDING - (window.innerHeight / mapObj.mapInfo.fullHeight) ) ) * MAP_RATIO);
    //console.log('Landscape',mapObj.mapInfo.scaledWidth, mapObj.mapInfo.scaledHeight);
  }
  var modal = document.getElementById(MODAL_DIV_ID);
  if (Math.min(mapObj.mapInfo.scaledWidth,mapObj.mapInfo.scaledHeight) < 600){
    //Small modal
    modal.classList.remove('w3-medium');
    modal.classList.add('w3-small');
  }else{
    //Medium modal
    modal.classList.remove('w3-small');
    modal.classList.add('w3-medium');
  }
  //Rescale map
  var cnv = document.getElementById('cnvGHmap');
  //console.log(mapObj.mapInfo.scaledWidth, mapObj.mapInfo.scaledHeight);
  //HEIGHT = WIDTH / MAP_RATIO
  cnv.style.width = mapObj.mapInfo.scaledWidth + "px";
  cnv.style.height = mapObj.mapInfo.scaledHeight + "px";
  //xScale,yScale scaleW/origW
  xScale = mapObj.mapInfo.scaledWidth / mapObj.mapInfo.fullWidth;
  yScale = mapObj.mapInfo.scaledHeight / mapObj.mapInfo.fullHeight;
  //Also rescale div holding the canvas
  document.getElementById('mapDiv').style.height = (mapObj.mapInfo.scaledHeight + 50) + "px";
  //Rescale point size
  // formula => pointSize = 8 * log (0.01 * width)
  var bigMult = 4;
  var logMult = 0.8;
  mapObj.mapInfo.pointSize = Math.floor(bigMult * Math.log(logMult * mapObj.mapInfo.scaledWidth));
  //Rescale font size
  //mapObj.mapInfo.font = Math.floor(mapObj.mapInfo.scaledHeight / 50) + "px Arial";
  mapObj.mapInfo.font = Math.floor(bigMult * Math.log(logMult * mapObj.mapInfo.scaledWidth)) + "px Arial";
  //Redraw the map
  completeMapRedraw(mapObj);
}

function completeMapRedraw(mapObj){
  var cnv = document.getElementById('cnvGHmap');
  drawMapOnCanvas(mapObj, cnv);
  applyContextSettings(cnv);
  drawAllScenarioPoints(mapObj, cnv);
}





function populateScenarioLists(mapObj){

  var scListOne = document.getElementsByClassName('scenarioListOneDiv');
  scListOne[0].innerHTML = '';
  //scListOne[1].innerHTML = '';
  var scListTwo = document.getElementsByClassName('scenarioListTwoDiv');
  scListTwo[0].innerHTML = '';
  //scListTwo[1].innerHTML = '';
  //Get the unlocked points
  const pointCount = mapObj.scenarioInfo.filter((p) => ((p.unlocked === true) && (p.locked !== true))).length;
  //Work out the halfway split to add to lists evenly
  var listOneCount = Math.floor(pointCount / 2);
  var index = 0
  //Add each unlocked point to the lists
  mapObj.scenarioInfo.filter((p) => ((p.unlocked === true) && (p.locked !== true))).forEach(function(p){
    //console.log('Foreach point', p.scenario, p.name);
    if (index > listOneCount){
      addScenarioToListDiv(p, scListTwo);
    }else{
      addScenarioToListDiv(p, scListOne);
    }
    index++;
  });
}

function addScenarioToListDiv(p, el){
  //console.log('Adding to list div', el.id, p.scenario);
  let newEl = document.createElement('p');
  newEl.innerHTML = p.scenario + ' - ' + p.name;
  newEl.style.border = '1px solid black';
  newEl.style.padding = '2px 0';
  newEl.style.backgroundColor = '#faf7c3';
  newEl.style.color = '#000000';
  newEl.id = 'scenarioLabel' + p.scenario;
  el[0].appendChild(newEl);
  //el[1].appendChild(newEl);
  newEl.addEventListener('click', function(e){
    //console.log(e.target);
    var rect = this.getBoundingClientRect();
    showModal(p, rect.left, rect.top, rect);
  });
  newEl.addEventListener('mouseover', function(e){
    e.target.style.border = '1px solid red';
    e.target.style.background = '#f0bbbb';
  });
  newEl.addEventListener('mouseout', function(e){
    e.target.style.border = '1px solid black';
    e.target.style.backgroundColor = '#faf7c3';
  });
}


function addScenarioElement(canvas, p){

  var rect = canvas.getBoundingClientRect();
  x = (p.xPos * xScale) + rect.left;
  console.log(p.scenario, rect.left, x);
  y = (p.yPos * yScale) + rect.top;
  console.log(p.scenario, rect.top, y);

  var pointEl = document.createElement('div');
  pointEl.style.position = 'fixed';
  pointEl.style.left = x + 'px';
  pointEl.style.top = y + 'px';
  pointEl.style.width = '50px';
  pointEl.style.height = '50px';
  pointEl.style.zIndex = 10;
  pointEl.style.border = '1px solid black';
  pointEl.style.borderRadius = '50%';
  pointEl.style.backgroundColor = getFillStyle(p);
  pointEl.style.color = 'black';
  pointEl.className = 'scenarioPoints';
  pointEl.innerHTML = p.scenario;
  document.querySelector('body').appendChild(pointEl);
  console.log('Add scenario point', p.scenario);

}

function updateFilter(text){
  //filterList();
  var input, filter;
  input = document.getElementById('filterInput');
  /*if (text.length == 0){
    input.value = '';
  } else {
    input.value = text;
  }*/
  input.value = text;
  filterList();
};

function filterList( ){

  var input, filter, ul, li, a;
  input = document.getElementById('filterInput');
  ul = document.getElementById('timeline-full');
  li = ul.getElementsByTagName('li');
  filter = input.value.toUpperCase();

  if (filter.length == 0){
    for (var i = 0; i < li.length; i++){
        li[i].style.display = '';
    }
    return true;
  }

  for (var i = 0; i < li.length; i++){

    try {
      var innerSpans = li[i].getElementsByTagName('div')[0].getElementsByTagName('span');

      if (innerSpans.length > 2){
        var tags = innerSpans[1].innerHTML.toUpperCase();
        var title = innerSpans[2].innerHTML.toUpperCase();
        console.log('Checking li',i,'Tags/Title:',tags,'/',title);
        if (  (tags.indexOf(filter) > -1) || (title.indexOf(filter) > -1) ) {
          li[i].style.display = '';
          console.log('Match - display',tags,title);
        } else {
          li[i].style.display = 'none';
          console.log('NO Match - hide',tags,title);
        }
      }
  } catch (e){
    console.error('Cannot parse - ',li[i].innerHTML);
  }

  }

};

function showHideEl(elName){
  console.log('Show/Hide',elName);
  let thisEl = document.getElementById(elName);
  if (thisEl.classList.contains("w3-show")){
    thisEl.classList.add("w3-hide");
    thisEl.classList.remove("w3-show");
  }else{
    thisEl.classList.remove("w3-hide");
    thisEl.classList.add("w3-show");
  }
}

(function(){

  'use strict';

  function elementIsInViewport(el){

    var vp = el.getBoundingClientRect();
    return (
      vp.top >= 0 &&
      vp.left >= 0 &&
      vp.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      vp.right <= (window.innerWidth || document.documentElement.clientWidth )
    );
  }


  function updateCheck(){
    var listItems = document.querySelectorAll('ul.timeline li.timeline-item');
    for (var i = 0; i < listItems.length; i++){
      if ( elementIsInViewport(listItems[i]) ){
        listItems[i].classList.add('inViewport');
      }else{
        listItems[i].classList.remove('inViewport');
      }
    }
  }

  window.addEventListener('scroll', updateCheck);
  window.addEventListener('load', updateCheck);
  window.addEventListener('resize', updateCheck);
})();



function OLDgenerateGHmap(mapObj){

  //console.log(mapObj);

  // Setup canvas and context
  var cnvs = document.querySelectorAll('canvas');
  ctx = [];
  ctx[0] = cnvs[0].getContext('2d');
  //ctx[1] = cnvs[1].getContext('2d');
  //var cnv = document.getElementById('cnvGHmap');
  //var ctx = cnv.getContext('2d');
  // Get the img content from the hidden element
  var mapImg = document.getElementById('ghFullMap');
  // Draw the PNG image to the canvas
  ctx[0].drawImage(mapImg,0,0,mapObj.mapInfo.fullWidth,mapObj.mapInfo.fullHeight,0,0,mapObj.mapInfo.scaledWidth,mapObj.mapInfo.scaledHeight);
  //ctx[1].drawImage(mapImg,0,0,mapObj.mapInfo.fullWidth,mapObj.mapInfo.fullHeight,0,0,mapObj.mapInfo.scaledWidth,mapObj.mapInfo.scaledHeight);
  // Setup scaling for points
  xScale = mapObj.mapInfo.scaledWidth / mapObj.mapInfo.fullWidth;
  yScale = mapObj.mapInfo.scaledHeight / mapObj.mapInfo.fullHeight;
  //Add points to the map
  i = 0;
  // Set styles
  //ctx.font = ICON_FONT;
  ctx[0].font = mapObj.mapInfo.font;
  ctx[0].fillStyle = COL_LIGHT;
  ctx[0].strokeStyle = COL_DARK;
  ctx[0].textAlign = 'center';
  //ctx[1].font = mapObj.mapInfo.font;
  //ctx[1].fillStyle = COL_LIGHT;
  //ctx[1].strokeStyle = COL_DARK;
  //ctx[1].textAlign = 'center';

  drawAllScenarioPoints(mapObj, cnvs[0]);
  //drawAllScenarioPoints(mapObj, cnvs[1]);

  populateScenarioLists(mapObj);

  var canvas = document.querySelector('canvas');

  window.addEventListener('resize', resizeWindow);

  canvas.onclick = function(e){

    // important: correct mouse position:
    var rect = this.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        i = 0, p;

    //console.log('Checking click',x,y);

    var points = mapObj.scenarioInfo;

    while (p = points[i++]){

      if (p.xPos && p.yPos){

        var withinXrange = ( ( x > (p.xPos * xScale) - (mapObj.mapInfo.pointSize / 2) ) && ( x < ( (p.xPos * xScale) + (mapObj.mapInfo.pointSize / 2) ) ) );
        var withinYrange = ( ( y > (p.yPos * yScale) - (mapObj.mapInfo.pointSize / 2) ) && ( y < ( (p.yPos * yScale) + (mapObj.mapInfo.pointSize / 2) ) ) );

        if (withinXrange && withinYrange){

          //console.log('Point found',p.scenario,p.name);
          document.getElementById('headingScenarioName').innerHTML = p.scenario + ' - ' + p.name + ' (in the ' + p.region + ')';
          strStatus = 'Scenario is NOT CURRENTLY AVAILABLE!';
          if (p.unlocked === true){
            strStatus = 'Scenario is CURRENTLY AVAILABLE!';
          }
          if (p.locked === true){
            strStatus = 'Scenario is LOCKED OFF!';
          }
          //if (p.completed)
          document.getElementById('headingScenarioStatus').innerHTML = strStatus;
          ctx.fillStyle = COL_HIGHLIGHT;
          p.selected = true;
          //drawHighlightBox(ctx,p);

        }else{

          ctx.fillStyle = getFillStyle(p);
          //ctx.fillStyle = COL_DEFAULT;
          p.selected = false;

        }

        // TEST - show only if available
        if (p.unlocked === true && p.locked !== true){

          drawScenarioPoint(ctx, p);
          //addScenarioElement(this, p);

        }
        // drawScenarioPoint(ctx, p);

      }

    }

  }

}