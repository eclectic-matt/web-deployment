//HANDLES A CLICK, SHOWING A MODAL IF A POINT WAS CLICKED
function canvasClick(e){

    //e.clientX = x-pos within viewport
    //e.screenX = x-pos in global (screen) coordinates
    //window.pageXOffset = how much the window has been scrolled (horizontally)
    // important: correct mouse position:
    var rect = this.getBoundingClientRect(),
    x = e.clientX - rect.left,
    y = e.clientY - rect.top,
    //x = e.screenX - rect.left,
    //y = e.screenY - rect.top,
    i = 0, p;

    console.log('Checking click',x,y);

    var pointSelected = false;

    var points = mapObj.scenarioInfo;

    while (p = points[i++]){

        if (p.xPos && p.yPos){

        var withinXrange = ( ( x > (p.xPos * xScale) - (mapObj.mapInfo.pointSize / 2) ) && ( x < ( (p.xPos * xScale) + (mapObj.mapInfo.pointSize / 2) ) ) );
        var withinYrange = ( ( y > (p.yPos * yScale) - (mapObj.mapInfo.pointSize / 2) ) && ( y < ( (p.yPos * yScale) + (mapObj.mapInfo.pointSize / 2) ) ) );

        if (withinXrange && withinYrange){

            //console.log('Point found',p.scenario,p.name);
            //document.getElementById('headingScenarioName').innerHTML = p.scenario + ' - ' + p.name + ' (in the ' + p.region + ')';
            strStatus = 'Scenario is NOT CURRENTLY AVAILABLE!';
            if (p.unlocked === true){
            strStatus = 'Scenario is CURRENTLY AVAILABLE!';
            }
            if (p.locked === true){
            strStatus = 'Scenario is LOCKED OFF!';
            }
            //document.getElementById('headingScenarioStatus').innerHTML = strStatus;
            p.selected = true;
            showModal(p, x, y, rect, e);
            pointSelected = true;

        }else{

            p.selected = false;

        }

        if (!pointSelected){
            hideModal();
        }

        }//end if(xPos&&yPos)

    }//end while(p)

}

function drawMapOnCanvas(mapObj, cnv){
    var ctx = cnv.getContext('2d');
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    // Draw the PNG image to the canvas
    var img = document.getElementById('ghFullMap');
    ctx.drawImage(img, 0, 0, mapObj.mapInfo.fullWidth, mapObj.mapInfo.fullHeight);
    /*var img = new Image();
    img.src = 'GH-Map.png';
    img.onload = function (e)
    {
        console.log('Draw img');
        //ctx.drawImage(img,  sx, sy, sWidth,                   sHeight,                    dx, dy, dWidth,                     dHeight);
        ctx.drawImage(img, 0, 0, mapObj.mapInfo.fullWidth, mapObj.mapInfo.fullHeight);
    }*/
}
  
function applyContextSettings(cnv){
    var ctx = cnv.getContext('2d');
    ctx.font = mapObj.mapInfo.font;
    ctx.fillStyle = COL_LIGHT;
    ctx.strokeStyle = COL_DARK;
    ctx.textAlign = 'center';
}

function drawAllScenarioPoints(mapObj, cnv){
    i = 0;
    var ctx = cnv.getContext('2d');
    ctx.beginPath();
    ctx.closePath();
    while(p = mapObj.scenarioInfo[i++]){
        //Need x and y coords
        if (p.xPos && p.yPos){
            // TEST - show only if available
            //if (p.unlocked === true && p.locked !== true){
            if (p.unlocked === true || p.completed === true){
                drawScenarioPoint(ctx, p);
                //addScenarioElement(cnv, p);
                //console.log('Draw point');
            }//end if p.unlocked
        }//end if p.xPos
    }//end while
}//end drawAll
  
function drawScenarioPoint(ctx, p){
    //DRAW THE POINT ITSELF
    ctx.beginPath();
    //var x = Math.floor(p.xPos * xScale);
    var x = p.xPos;
    //var y = Math.floor(p.yPos * yScale);
    var y = p.yPos;
    ctx.arc(x, y, mapObj.mapInfo.pointSize, 0, 2 * Math.PI);
    //FILL THE POINT IN THE APPROPRIATE COLOUR
    if (p.selected){
        ctx.fillStyle = COL_HIGHLIGHT;
    }else{
        ctx.fillStyle = getFillStyle(p);
    }

    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    //DRAW SCENARIO NUMBER
    ctx.fillStyle = COL_DARK;
    ctx.font = "normal " + mapObj.mapInfo.fontSize + "px" + mapObj.mapInfo.fontFamily;
    ctx.fillText(p.scenario, x, y + (mapObj.mapInfo.pointSize / 3));
    ctx.closePath();
    //ADD A STATUS (CHECK/CROSS/HIGHLIGHT) TO THE POINT
    drawPointStatus(ctx,p);
}
  
function drawPointStatus(ctx,p){
    var fontMult = 4;
    ctx.beginPath();
    // Add a check if completed
    if (p.completed === true){
        checkId = '\u2713';
        ctx.fillStyle = "green";
        ctx.font = "bolder " + (fontMult * mapObj.mapInfo.fontSize) + "px" + mapObj.mapInfo.fontFamily;// + " bold";
        //ctx.fillText(checkId, p.xPos * xScale + (0.7 * mapObj.mapInfo.pointSize), p.yPos * yScale + (mapObj.mapInfo.pointSize));
        ctx.fillText(checkId, p.xPos + (0.4 * mapObj.mapInfo.pointSize), p.yPos + (0.8 * mapObj.mapInfo.pointSize));
    // Add a cross if locked
    }else if (p.locked === true){
        ctx.fillStyle = "red";
        ctx.font = "bolder " + (fontMult * mapObj.mapInfo.fontSize) + "px" + mapObj.mapInfo.fontFamily;// + " bold";
        //ctx.fillText("X", p.xPos * xScale + (0.7 * mapObj.mapInfo.pointSize), p.yPos * yScale + (mapObj.mapInfo.pointSize));
        ctx.fillText("X", p.xPos + (0.4 * mapObj.mapInfo.pointSize), p.yPos + (0.8 * mapObj.mapInfo.pointSize));
    // Add a highlight border if still available
    }else if (p.unlocked === true){
        ctx.strokeStyle = "green";
        ctx.lineWidth = Math.floor(mapObj.mapInfo.pointSize / 3);
        //ctx.arc(Math.floor(p.xPos * xScale), Math.floor(p.yPos * yScale), 1.25 * mapObj.mapInfo.pointSize, 0, 2 * Math.PI);
        ctx.arc(Math.floor(p.xPos), Math.floor(p.yPos), 0.9 * mapObj.mapInfo.pointSize, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.closePath();
}

function getFillStyle(p){
    switch (p.region){
        case 'Misty Sea':
            return COL_MISTY;
            break;
        case 'City of Gloomhaven':
            return COL_GLOOMHAVEN;
            break;
        case 'Watcher Mountains':
            return COL_WATCHER;
            break;
        case 'Copperneck Mountains':
            return COL_COPPERNECK;
            break;
        case 'Lingering Swamp':
            return COL_LINGERING;
            break;
        case 'Dagger Forest':
            return COL_DAGGER;
            break;
        case 'Crypts':
            return COL_CRYPTS;
            break;
        default:
            return COL_LIGHT;
            break;
    }
}
  
function drawHighlightBox(ctx,p){
  
    ctx.beginPath();
    ctx.rect(p.xPos - 50, p.yPos - 100, 100, 75);
    ctx.fill();
    ctx.font = "normal " + mapObj.mapInfo.fontSize + "px" + mapObj.mapInfo.fontFamily;
    ctx.lineWidth = 5;
    ctx.strokeText(p.scenario + " - " + p.name, p.xPos, p.yPos - 75);
    drawPointStatus(ctx,p);
    ctx.closePath();
  
}