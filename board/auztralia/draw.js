hexScale = 20;
targetWidth = 900;
targetHeight = 700;

function drawOntoCanvas(highlightRow, highlightCol){

	var cnv = document.getElementById('canvas');
	var ctx = cnv.getContext('2d');

	//RESET STYLES
	ctx.strokeStyle = '#000';
	ctx.strokeWidth = '5px';

	//drawHexGrid(ctx, cnv.width, cnv.height, hexScale, highlightRow, highlightCol);
	//drawHexGrid(ctx, cnv.width, cnv.height, 50, highlightRow, highlightCol);
	drawHexGrid(ctx, targetWidth, targetHeight, 50, highlightRow, highlightCol);
}

function initWindowScale(){
	var cnv = document.getElementById('canvas');
	var ctx = cnv.getContext('2d');

	//RESET TRANSFORMS
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	clearCanvas(ctx,cnv.width,cnv.height);

	//GET SCALE
	var widthScale = 1 - cnv.width / targetWidth;
	var heightScale = 1 - cnv.height / targetHeight;

	//APPLY TO CANVAS
	ctx.scale(widthScale, heightScale);
	
	console.log(widthScale,heightScale);
}

function adjustWindowScale(){

	var cnv = document.getElementById('canvas');
	var ctx = cnv.getContext('2d');

	//RESET TRANSFORMS
	ctx.setTransform(1, 0, 0, 1, 0, 0);

	//clearCanvas(ctx,cnv.width,cnv.height);

	//GET SCALE
	var widthScale = cnv.width / targetWidth;
	var heightScale = cnv.height / targetHeight;

	//APPLY TO CANVAS
	ctx.scale(widthScale, heightScale);
	
	console.log(cnv.width, cnv.height, widthScale,heightScale);

	//DRAW CANVAS
	drawOntoCanvas(options['highlightRow'], options['highlightCol']);
}

window.addEventListener('resize', adjustWindowScale);

function clearCanvas(ctx, w, h){
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	//ctx.scale(1,1);
	ctx.fillStyle = '#fff';
	ctx.rect(0,0,w,h);
	ctx.fill();
}


//https://eperezcosano.github.io/hex-grid/
function drawHexGrid(ctx, width, height, r, highlightRow, highlightCol){

	const a = 2 * Math.PI / 6;
	row = 0;
	maxRow = grid.length;
	maxCol = grid[maxRow - 1].length;

	//OFFSET FROM EDGES?
	var xOffset = 0;//100;
	var yOffset = 0;//100;

	//FOR EACH COLUMN
	//y starts at r (scale factor, side length)
	//y plus the next increment must remain below the height
	//y increments by r * sin(a) = r * sin(60) = sqrt(3)/2 * r
	for(let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)){

		//START A COLUMN INDEX
		col = 0;
		//IF WE HAVE REACHED THE MAX ROW, STOP
		if(row >= maxRow){
			return true;
		}

		//FOR EACH ROW
		//x starts at r (scale factor, )
		//j starts at 0
		//x plus the next increment must be less than width
		//x increments by r * (1 + cos(60)) = r * (1 + 1/2) = 1.5 * r
		//j increments by 1
		//y's additional increment is between -r/2 and +r/2 
		//	(-1 to the power of j[0,1,2] = 1, -1, 1
		//	((-1) ** j) * r * sin(60) = -1/2 * r OR +1/2 * r)
		for(let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)){


			//IF WE HAVE REACHED THE MAX COLUMN, CONTINUE (NEXT ROW)
			if(col >= maxCol){
				continue;
			}

			//IF THIS ROW IS THE CURRENT HIGHLIGHT ROW
			if ( (row === highlightRow) && (col === highlightCol) ){

				//DRAW THIS HEXAGON WITH A HIGHLIGHT COLOUR
				drawHexagon(ctx, x + xOffset, y + yOffset, 0.95*r, row, col, '#fca503');
			}else{

				//DRAW THIS HEXAGON (NORMAL)
				drawHexagon(ctx, x + xOffset, y + yOffset, r, row, col, null);
			}
			col++;

		}
		row++;
	}
}

function drawHexagon(ctx, x, y, r, row, col, colour = null){

	//GET THE HEX FROM THE GRID
	hex = grid[row][col];

	//CONTEXT SETTINGS
	ctx.lineWidth = 5;

	if (colour === null){
		drawHexagonShape(ctx, x, y, r, getHexFillColour(hex));
	}else{
		drawHexagonShape(ctx, x, y, r, colour);
	}

	ctx.fillStyle = '#000';

	//PRINT NUMBER IF PRESENT
	if(!isNaN(hex.id)){
		drawHexId(ctx, x, y, hex.id, hex.setupTile);
	}
	//PRINT TRIANGLE ON SETUP TILES
	if(hex.setupTile){
		
		drawTriangle(ctx, x + 15, y + 25, 18, '#666');
	}

	//PRINT LEVEL IF PRESENT
	if(hex.level > 0){
		switch(hex.level){
			case 1:
				col = '#9c0';
				break;
			case 2: 
				col = '#060';
				break;
			case 3:
				col = '#900';
				break;
		}
		drawLevelCircle(ctx, x, y, hex.level, col);
	}
	
	//PRINT RESOURCES
	ctx.font = '10px Arial';
	
	for(let i = 0; i < Object.keys(hex.resources).length; i++){

		if(hex.resources[Object.keys(hex.resources)[i]] > 0){

			switch(Object.keys(hex.resources)[i]){
				case 'iron':
					drawIron(ctx, x - 40, y - 5, 5, hex.resources[Object.keys(hex.resources)[i]]);
					break;
				case 'coal':
					drawCoal(ctx, x - 20, y - 5, 5, hex.resources[Object.keys(hex.resources)[i]]);
					break;
				case 'phos':
					drawPhos(ctx, x, y - 5, 5, hex.resources[Object.keys(hex.resources)[i]]);
					break;
				case 'gold':
					drawGold(ctx, x + 20, y - 5, 5, hex.resources[Object.keys(hex.resources)[i]]);
					break;
				case 'olds':
					//IF THERE ARE OLD ONES IN THIS HEX
					if (hex.resources[Object.keys(hex.resources)[i]] > 0){
						//CALCULATE OLD ONE LEVEL (IF oldOne = 1, oldOneLevel = hex.level, IF oldOne >= 2, oldOneLevel = hex.level + 1)
						var oldOneLevel = Math.min(hex.level - 1 + hex.resources[Object.keys(hex.resources)[i]], 3);
						drawOldOne(ctx, x + 10, y - 22, 5, oldOneLevel);
					}
					break;
			}
		}
	}
}

function getHexFillColour(hex){
	if(hex.type === undefined){
		return '#fff';
	}else{
		return hexTypes[hex.type].color;
	}
}

//https://eperezcosano.github.io/hex-grid/
function drawHexagonShape(ctx, x, y, r, col){

	const a = 2 * Math.PI / 6;
	ctx.beginPath();
	ctx.fillStyle = col;
	//DRAW THE 6 SIDES OF THE HEX
	for(let i = 0; i < 6; i++){
		ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
	}
	ctx.closePath();
	ctx.stroke();
	ctx.fill();
}

function drawCoal(ctx, x, y, scale, count){
	ctx.beginPath();
	ctx.moveTo(x,y);
	ctx.lineTo( x + (3 * scale), y - scale);
	ctx.lineTo( x + (4 * scale), y + (3 * scale) );
	ctx.lineTo( x + scale, y + (2 * scale) );
	ctx.lineTo(x, y);
	ctx.closePath();
	ctx.fillStyle = "#000";
	ctx.fill();
	ctx.fillStyle = "#fff";
	ctx.fillText(count, x + (1.5 * scale), y + (1.5 * scale));
}

function drawIron(ctx, x, y, scale, count){
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo( x + (4 * scale), y - scale);
	ctx.lineTo( x + (5 * scale), y);
	ctx.lineTo( x + (5 * scale), y + (2 * scale) );
	ctx.lineTo( x + scale, y + (3 * scale) );
	ctx.lineTo( x, y + (2 * scale) );
	ctx.lineTo( x, y);
	ctx.closePath();
	ctx.fillStyle = "#bbb";
	ctx.fill();
	ctx.fillStyle = "#000";
	ctx.fillText(count, x + (1.5 * scale), y + (2 * scale));
}

function drawPhos(ctx, x,  y, scale, count){
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo( x + (2 * scale), y - scale);
	ctx.lineTo( x + (4 * scale), y + scale);
	ctx.lineTo( x + (2 * scale), y + (2 * scale) );
	ctx.lineTo( x, y + (1 * scale) );
	ctx.lineTo( x, y );
	ctx.closePath();
	ctx.fillStyle = "#fff";
	ctx.fill();
	ctx.fillStyle = "#000";
	ctx.fillText(count, x + (1.5 * scale), y + scale);
}

function drawGold(ctx, x, y, scale, count){
	ctx.beginPath();
	ctx.moveTo(x, y);
	ctx.lineTo( x + (2 * scale), y - (2 * scale) );
	ctx.lineTo( x + (4 * scale), y);
	ctx.lineTo( x + (3 * scale), y + (2 * scale) );
	ctx.lineTo( x, y);
	ctx.closePath();
	ctx.fillStyle = "#fc0";
	ctx.fill();
	ctx.fillStyle = "#000";
	ctx.fillText(count, x + (1.5 * scale), y + scale);
}

/**
 * @param scale (int) The multiplier for all drawings.
 */
function drawOldOne(ctx, x, y, scale, level){
	ctx.beginPath();
	ctx.arc (x + (1.5 * scale), y - (1.5 * scale), 2 * scale, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fillStyle = "#a0b";
	ctx.fill();
	ctx.fillStyle = "#ff0";
	ctx.fillText(level, x + scale, y - scale);
}

function drawHexId(ctx, x, y, id, setupTile = false){
	ctx.beginPath();
	ctx.fillStyle = '#000';
	ctx.arc(x - 15, y + 25, 10, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = '#fff';
	ctx.moveTo(x - 15, y + 25);
	ctx.arc(x - 15, y + 25, 6, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.fillStyle = '#000';
	if(id < 10){
		ctx.fillText(id, x - 17, y + 28);	
	}else{
		ctx.fillText(id, x - 20, y + 28);
	}
}

function drawLevelCircle(ctx, x, y, level, col){
	scale = 5;
	ctx.beginPath();
	ctx.fillStyle = '#fff';
	ctx.arc(x - (4 * scale), y - (6 * scale), 10, 0, 2 * Math.PI);
	ctx.fill();
	ctx.fillStyle = col;
	ctx.moveTo(x - 20, y - 30);
	ctx.arc(x - 20, y - 30, 8, 0, 2 * Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.font = '12px Arial';
	ctx.fillStyle = '#fff';
	ctx.fillText(level, x - 24, y - 26);
}

function drawTriangle(ctx, x, y, r, col){
	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.moveTo(x-(r/2),y+(r/2));
	ctx.lineTo(x+(r/2),y+(r/2));
	ctx.lineTo(x,y-(r/2));
	ctx.lineTo(x-(r/2),y+(r/2));
	ctx.fill();
	ctx.closePath();
	ctx.beginPath();
	ctx.fillStyle = '#fff';
	ctx.arc(x, y + 1, 2, 0, 2 * Math.PI, false);
	ctx.fill();
	ctx.closePath();
}
