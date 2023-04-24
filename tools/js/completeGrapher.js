/*
Complete Grapher Version 0.5
Last Edit: 30/11/15 19:00pm Notepad++ @ Home
Changes: Added sine in beta
V 0.4 Edit: 02/05/14 13:00pm Notepad++ @ Home
Changes: Cleaned up code, debug setting for console.
*/

var cnvW = 400;
var cnvH = 400;

// Add variables for default drop-down lists
var points = 8;

//$var regular = true;
var type = 'regular';

var biDirectional = false;
//var edges = ??

// x, y
var nodes = [[]];
// node1 , node2
var edges = [[]];

var minC = 20;
var maxC = 255;
var nodeW = 2;
var lineW = 1;
var offset;
var anim = 0;
var rotate = 0;
var rotateAngle = 0;
var rotateInc = 0.01;
var timer;
var debug = 0;

function init(){
	
	if (debug){
		console.log("Time to make some graphs");
	}
	//Initialise canvas properties
	c = document.getElementById("canvas");
	c.height = cnvH;
	c.width = cnvW;
	c.addEventListener("touchstart", doTouch, false);
	c.addEventListener("mousedown", doClick, false);
 
	// When canvas found, set context to 2d and begin
	if (c.getContext){
		ctx = c.getContext("2d");   
		canv = $("#canvas");
		offset = canv.offset();
		
		var button = document.getElementById('graphDownload');
		button.addEventListener('click', function (e) {
			var dataURL = canvas.toDataURL('image/png');
			window.location = dataURL;
		});
	  
		var redraw_button = document.getElementById('redraw');
		redraw_button.addEventListener('click', function (e) {
			resetCanvas();
			if (rotate == true){
				rotateAngle += rotateInc;
			}
			createCompleteGraph(points, type);
		});
		
		animate_button = document.getElementById('animate');
		animate_button.addEventListener('click', function (e) {
			if (anim == 0){
				anim = 1;
				animate_button.innerHTML = "Animate Off";
				animate();	
			}else{
				anim = 0;
				clearTimeout(timer);
				animate_button.innerHTML = "Animate On";
			}
			
		});
		
		rotate_button = document.getElementById('rotate');
		rotate_button.addEventListener('click', function (e) {
			if (rotate == 0){
				rotate = 1;
				rotateAngle += rotateInc;
				rotate_button.innerHTML = "Rotate Off";
			}else{
				rotate = 0;
				rotate_button.innerHTML = "Rotate On";
			}
			
		});
    
		resetCanvas();
		createCompleteGraph(points, type);
	}
}

function doTouch(event){
    canv = $( "#canvas" );
	offset = canv.offset();
    event.preventDefault();  
    touchx = Math.floor(event.targetTouches[0].pageX - offset.left);
    touchy = Math.floor(event.targetTouches[0].pageY - offset.top);
   	checkTap();
 
}

function doClick(event){
    canv = $( "#canvas" );
	offset = canv.offset();
    event.preventDefault();  
    touchx = Math.floor(event.pageX - offset.left);
    touchy = Math.floor(event.pageY - offset.top);
	checkTap();

}

function checkTap(){

	if (type == 'free'){
		
		b = nodes.length - 1;
		
		for (a = 0; a < b;a++){
			
			if ((Math.abs(touchx - nodes[a][0]) < nodeW) && (Math.abs(touchy - nodes[a][1]) < nodeW)){
				
				// Remove node
				nodes.splice(a,1);
				if (debug){
					console.log('Removed a node, only '+nodes.length+' now.');
				}
				resetCanvas();
				document.getElementById('info').innerHTML = "Removed a node!<br>Redrawn!";
				edges.length = 0;
				b = nodes.length;
				for (x = 0; x < b; x++){
					nexty:
					for (y = 0; y < b; y++){

						if ((x == y)){continue nexty;}
						if ((biDirectional == false) && (x>0 && y<x)){continue nexty;}
						
						rgbC = "rgb("+randomCol()+","+randomCol()+","+randomCol()+")";
						ctx.strokeStyle = rgbC;
						
						drawEdge(nodes[x][0],nodes[x][1],nodes[y][0],nodes[y][1]);
						edges.push([x,y]);
						
					}
				
				}
				
				ctx.fillStyle = "#FFFFFF";
				for (x = 0; x < b; x++){
					drawNode(nodes[x][0],nodes[x][1],nodeW);
				}
	
				
				return;
			}
		
		}
		
		ctx.fillStyle = "#FFFFFF";
		drawNode(touchx, touchy, nodeW);
		nodes.push([touchx,touchy]);
		b = nodes.length;
		if (debug){
			console.log('Added a new node at ('+touchx+','+touchy+'). Total = '+b+' now.');
		}
		if (b > 1){
		
			for (a = 0; a < b-1; a++){
			
				rgbC = "rgb("+randomCol()+","+randomCol()+","+randomCol()+")";
				ctx.strokeStyle = rgbC;
				drawEdge(nodes[a][0],nodes[a][1],nodes[b-1][0],nodes[b-1][1]);
				edges.push([a,b-1]);

			}
			
		}

				e = edges.length;
				document.getElementById('info').innerHTML = "Drawing a "+b+"-point FREEHAND graph<br>with "+e+" edges";
			
		
	}

}

function resetCanvas(){

	ctx.fillStyle ="#000000";
	ctx.fillRect(0,0,c.width,c.height);

}

function createCompleteGraph(p, t){
	document.getElementById('info').innerHTML = "Updating.... Please wait....";
	nodes.length = 0;
	edges.length = 0;
		
	midx = c.width / 2;
	midy = c.height / 2;
	shortest = Math.min(c.width,c.height);
	radius = 0.45*shortest;
	if (debug){
		console.clear();
		console.log("---------------------------------");
	}
	//initial values
	switch (t){
	
	case 'irregular':
		var gType = "irregular";
		x0 = midx - radius + (Math.random() * radius);
		y0 = midy - radius + (Math.random() * radius);
		break;
		
	case 'regular':
		var gType = "regular";
		//x0 = midx + radius;
		//y0 = midy;
		// rotateAngle as initial
		x0  = midx + radius*Math.cos(rotateAngle);
		y0 = midy + radius*Math.sin(rotateAngle);
		break;
		
	case 'conch':
		shrink = radius / p;
		//x0 = midx + radius;
		//y0 = midy;
		// rotateAngle as initial
		x0  = midx + radius*Math.cos(rotateAngle);
		y0 = midy + radius*Math.sin(rotateAngle);
		break;
	
	case 'sine':
		x0  = midx;
		y0 = midy;
		break;
	
	
	case 'free':
		return;
		break;
	
	}	
	today = new Date();
	ctx.fillStyle ="#FFFFFF";
	ctx.lineWidth = lineW;
	spreadAngle = (2*Math.PI) / p;
	if (debug){
		console.log("Creating a complete, "+t+" graph");
		console.log("with "+p+ " points");
		console.log("Started at: "+today);
		console.log("---------------------------------");
		console.log("---------------------------------");
		console.log("Let's start by adding the nodes");
		console.log("---------------------------------");
	}
	drawNode(x0,y0,nodeW);
	nodes.push([x0,y0]);
	if (debug){
		console.log("Node 0 added.");
		console.log("Location: x = "+Math.floor(x0)+" and y = "+Math.floor(y0));
		console.log("Total Nodes = "+nodes.length);
	}
	// For each of the points... 
	for (a = 1; a < p; a++){
		
		if (t == 'irregular'){
			spreadAngle = Math.random() * 2 * Math.PI;
			radius = 0.45*Math.random()*shortest;
		}
		else if (t == 'conch'){
			radius = 0.45*shortest - a*shrink;
		}
		else if (t == 'sine'){
			radius = 0.45*shortest*Math.sin(2*a/Math.PI);
		}
		
		//x1 = midx + radius*Math.cos(a * spreadAngle);
		//y1 = midy + radius*Math.sin(a * spreadAngle);
		// Angle applied here
		x1 = midx + radius*Math.cos(rotateAngle + (a * spreadAngle));
		y1 = midy + radius*Math.sin(rotateAngle + (a * spreadAngle));
		nodes.push([x1,y1]);
		//drawNode(x1,y1,nodeW);
		if (debug){
			console.log("---------------------------------");
			console.log("Node "+a+" added.");
			console.log("Total Nodes = "+nodes.length);
			console.log("Location: x = "+Math.floor(x1)+" and y = "+Math.floor(y1));
			console.log("---------------------------------");
		}
	
	}

	if (debug){
		console.log("---------------------------------");
		console.log("Nodes added. Time to join them up");
		console.log("---------------------------------");
	}
	
	for (a = 0; a < p; a ++){
	
		nextb:
		for (b = 0; b < p; b++){
			if ((a == b)){continue nextb;}
			
			if ((biDirectional == false) && (a>0 && b<a)){continue nextb;}
			
			rgbC = "rgb("+randomCol()+","+randomCol()+","+randomCol()+")";
			ctx.strokeStyle = rgbC;
			
			drawEdge(nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1]);
			edges.push([a,b]);
			if (debug){
				console.log("---------------------------------");
				console.log("Edge added between nodes "+a+" and "+b);
				console.log("Colour = "+rgbC);
				console.log("Total Edges = "+edges.length);
				console.log("---------------------------------");
			}
		}
	
	}

	for (a = 0; a < p; a++){
    
    		drawNode(nodes[a][0],nodes[a][1],nodeW);
    
    }
	end = new Date();
	diff = end - today;
	if (debug){
		console.log("-------------------------------");
		console.log("Graph complete.");
		console.log("Total edges = "+edges.length);
		console.log("Finished at "+end);
		console.log("Took "+diff+" milliseconds");
		console.log("-------------------------------");
	}
  var difftext = (diff == 0)? 'under 1' : diff;
	document.getElementById('info').innerHTML = p +"-point "+t+" graph complete.<br>Total edges = "+edges.length+".<br>Took "+difftext+"ms to draw.";
	
}

function append(val){

	if (val < 10){
	
		val = "0" + val;
		
	}

}

function randomCol(){
	
	return Math.floor(Math.min(maxC,Math.max(minC,(255*Math.random()))));

}

function drawNode(x,y,r){

 x = Math.floor(x);
 y = Math.floor(y);
 ctx.beginPath();
 ctx.arc(x,y,r,0,2*Math.PI,false);
 ctx.fill();
 ctx.closePath();

}

function drawEdge(x,y,a,b){

 x = Math.floor(x);
 y = Math.floor(y);
 a = Math.floor(a);
 b = Math.floor(b);
 ctx.beginPath();
 ctx.moveTo(x,y);
 ctx.lineTo(a,b);
 ctx.stroke();
 ctx.closePath();

}

function pointsUpdate(value){
	document.getElementById('info').innerHTML = "Updating points.... Please wait....";
	points = value;
	if (debug){
		console.log("----------------------------------");
		console.log("----------------------------------");
		console.log("POINTS UPDATED");
		console.log("GOING TO REDRAW WITH "+points+" POINTS");
		console.log("----------------------------------");
		console.log("----------------------------------");
	}
	resetCanvas();
	createCompleteGraph(points, type);
	
}


function typeUpdate(value){

	document.getElementById('info').innerHTML = "Updating type.... Please wait....";
	if (debug){
		console.log("----------------------------------");
		console.log("----------------------------------");
		console.log("TYPE UPDATED");
	}

switch (value){
    case 'irregular':
        var gType = "AN IRREGULAR";
        type = value; 
		animate_button.style.display = "block";
        break;
    case 'regular':
        var gType = "A REGULAR";
        type = value; 
		animate_button.style.display = "block";
        break;
    case 'conch':
        var gType = "A CONCH";
        type = value; 
		animate_button.style.display = "block";
        break;
	case 'sine':
        var gType = "A SINE";
        type = value; 
		animate_button.style.display = "block";
        break;
    case 'free':
        var gType = "A CUSTOM";
        type = value;
		document.getElementById('info').innerHTML = "Now start drawing!";
    animate_button.style.display = "none";
		animate_button.innerHTML = "Animate On";
		anim = 0;
		clearTimeout(timer);
        break;
    }

	if (debug){
		console.log("GOING TO REDRAW "+gType+" graph");
		console.log("----------------------------------");
		console.log("----------------------------------");
	}
	resetCanvas();
	createCompleteGraph(points, type);

}

function animate(){
	resetCanvas();
	if (rotate == true){
		rotateAngle += rotateInc;
	}
	createCompleteGraph(points, type);
	timer=setTimeout(function(){animate()},diff);
}

