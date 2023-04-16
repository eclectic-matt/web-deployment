function drawClubs(x,y,r,col){

	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.moveTo(x+r, y+(r/4));
	ctx.arc(x+(r/2), y+(r/4), (r/2), 0, 2*Math.PI, false);
	ctx.fill();
	ctx.moveTo(x,y+(r/4));
	ctx.arc(x-(r/2),y+(r/4),(r/2),0,2*Math.PI, false);
	ctx.fill();
	ctx.moveTo(x+(r/2),y-(r/2));
	ctx.arc(x,y-(r/2),(r/2),0,2*Math.PI, false);
	ctx.fill();
	ctx.fillRect(x-(r/4),y,(r/2),r-1);
	ctx.closePath();


}

function drawCircle(x,y,r,col){
	
	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.closePath();
	
}

function drawDiamond(x, y, w, h, col){
	
	w = w/2;
	h = h/2;
	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.moveTo(x+w, y);
	ctx.lineTo(x, y+h);
	ctx.lineTo(x-w, y);
	ctx.lineTo(x,y-h);
	ctx.lineTo(x+w,y);
	ctx.fill();
	ctx.closePath();

}

function drawCross(x,y,w,h,thick,col){

	var orig = ctx.lineWidth;
	ctx.lineWidth = thick;
	ctx.strokeStyle = col;
	ctx.beginPath();
	ctx.moveTo(x,y-(h/2));
	ctx.lineTo(x,y+(h/2));
	ctx.stroke();
	ctx.moveTo(x-(w/2),y);
	ctx.lineTo(x+(w/2),y);
	ctx.stroke();
	ctx.closePath();
	ctx.lineWidth = orig;
	
}

function drawTriangle(x,y,r,col){

	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.moveTo(x-(r/2),y-(r/2));
	ctx.lineTo(x+(r/2),y-(r/2));
	ctx.lineTo(x,y+(r/2));
	ctx.lineTo(x-(r/2),y-(r/2));
	ctx.fill();
	ctx.closePath();

}

function drawStar(x,y,r,col){

	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.moveTo(x-r,y-(r/2));
	ctx.lineTo(x+r,y-(r/2));
	ctx.lineTo(x-r,y+r);
	ctx.lineTo(x,y-r);
	ctx.lineTo(x+r,y+r);
	ctx.lineTo(x-r,y-(r/2));
	ctx.fill();
	ctx.closePath();

}

function drawHeart(x, y, w, h, col){

	w = w/2;
	h = h/2;
	ctx.fillStyle = col;
	ctx.strokeStyle = col;
	ctx.beginPath();
	ctx.moveTo(x,y-(h/2));
	ctx.lineTo(x,y+h);
	ctx.lineTo(x+w,y-h/2);
	ctx.lineTo(x-w,y-h/2);
	ctx.lineTo(x,y+h);
	//ctx.fill();
	ctx.moveTo(x+w, y -(h/2));
	ctx.arc(x+(w/2), y - (h/2), (w/2), 0, Math.PI, true);
	//ctx.fill();
	//ctx.moveTo(x,y-(h/2));
	ctx.arc(x-(w/2),y-(h/2),(w/2),0,Math.PI, true);
	ctx.fill();
	ctx.closePath();
	
}

function randomAlpha(){

	return r = String.fromCharCode(65+Math.floor(26*Math.random()));

}