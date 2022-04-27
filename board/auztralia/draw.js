function drawOntoCanvas(highlightRow, highlightCol){

	//console.log('Drawing hex grid now');
	var cnv = document.getElementById('canvas');
	var ctx = cnv.getContext('2d');
	ctx.strokeStyle = '#000';
	ctx.strokeWidth = '5px';
	//drawHexGrid(ctx, cnv.width, cnv.height, 50, highlightRow, highlightCol);
	drawHexGrid(ctx, cnv.width, cnv.height, 50, highlightRow, highlightCol);
}

//https://eperezcosano.github.io/hex-grid/
function drawHexGrid(ctx, width, height, r, highlightRow, highlightCol){

	//console.log('Drawing grid',highlightRow, highlightCol);
	const a = 2 * Math.PI / 6;
	row = 0;
	maxRow = grid.length;
	maxCol = grid[maxRow - 1].length;

	for(let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)){

		col = 0;
		if(row >= maxRow){
			return true;
		}

		for(let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)){

			if(col >= maxCol){
				continue;
			}

			if ( (row === highlightRow) && (col === highlightCol) ){
				//console.log('Drawing highlight hex!', row, col);
				drawHexagon(ctx, x, y, 0.9*r, row, col, '#fca503');
			}else{
				//console.log('Drawing normal hex!', row, col);
				drawHexagon(ctx, x, y, r, row, col, null);
			}
			col++;

		}
		row++;
	}
}

//https://eperezcosano.github.io/hex-grid/
function drawHexagon(ctx, x, y, r, row, col, colour = null){

	hex = grid[row][col];
	//console.log('Drawing hexagon at', x, y);
	let title = hex.id;

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
		
		drawTriangle(ctx, x + 1, y + 25, 15, '#666');
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
					if (hex.resources[Object.keys(hex.resources)[i]] > 0){
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
	ctx.arc (x + (1.5 * scale), y - (1.5 * scale), 1.5 * scale, 0, 2 * Math.PI);
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
}
