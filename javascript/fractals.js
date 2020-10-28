/*

https://www.codingame.com/playgrounds/2358/how-to-plot-the-mandelbrot-set/adding-some-colors

https://stackoverflow.com/questions/16500656/which-color-gradient-is-used-to-color-mandelbrot-in-wikipedia

*/

const ARR_COLOURS = {
  "Ultra Fractal": [
    'rgb(66, 30, 15)',
    'rgb(25, 7, 26)',
    'rgb(9, 1, 47)',
    'rgb(4, 4, 73)',
    'rgb(0, 7, 100)',
    'rgb(12, 44, 138)',
    'rgb(24, 82, 177)',
    'rgb(57, 125, 209)',
    'rgb(134, 181, 229)',
    'rgb(211, 236, 248)',
    'rgb(241, 233, 191)',
    'rgb(248, 201, 95)',
    'rgb(255, 170, 0)',
    'rgb(204, 128, 0)',
    'rgb(153, 87, 0)',
    'rgb(106, 52, 3)'
  ],
  "Pinky Green": [
    'rgb(50, 85, 10)',
    'rgb(75, 87, 26)',
    'rgb(9, 151, 47)',
    'rgb(4, 200, 73)',
    'rgb(0, 225, 100)',
    'rgb(12, 255, 138)',
    'rgb(24, 160, 177)',
    'rgb(57, 125, 209)',
    'rgb(134, 81, 229)',
    'rgb(211, 36, 248)',
    'rgb(241, 93, 191)',
    'rgb(100, 51, 95)',
    'rgb(120, 10, 180)',
    'rgb(135, 10, 200)',
    'rgb(150, 10, 220)',
    'rgb(180, 0, 255)'
  ]
};

// THE WIDTH OF THE CANVAS
const CNV_WIDTH = 800;
// THE HEIGHT OF THE CANVAS
const CNV_HEIGHT = 600;
// THE MAXIMUM RGB COL VALUE
const COL_MAX = 255;
// THE MAXIMUM HEX COL VALUE
const HEX_MAX = 65535;
// THE NUMBER OF ITERATIONS TO CHECK (MORE DETAIL)
//const ITERATIONS = 100;
// THE LIMIT TO COUNT AS INSIDE THE SET
const LIMIT = 2;
// THE INITIAL RANGE OF x/y VALUES -2 -> +2
const RANGE = 4;

// THE INITIAL MINIMUM X VALUE
var xMin = -2;
// THE INITIAL MINIMUM Y VALUE
var yMin = -2;
// THE INITIAL ZOOM LEVEL
var zoomLevel = 1;
// THE INITIAL COLOUR SCHEME
var colourScheme = "Ultra Fractal";
// THE NUMBER OF ITERATIONS TO CHECK (MORE DETAIL)
var maxIterations = 16;
// AN ARRAY OF RANDOM COLOURS
var randomCols = [];
// THE FRACTAL TYPE TO GENERATE
var fractalType = 'mandlebrot';

// THIS IS THE FUNCTION THAT CALLS THE GENERATOR
function fractalStart(){

  // USUALLY A CHANGE IN ZOOM HAS BEEN MADE
  document.getElementById('spanZoom').innerHTML = zoomLevel;

    // START TO MEASURE PERFORMANCE
	  let tStart = performance.now();

  // CALL THE FUNCTION GENERATING THE MANDLEBROT SET
	generateFractal(xMin, yMin, maxIterations, LIMIT, fractalType);

    // END TO MEASURE PERFORMANCE
	  let tEnd = performance.now();
    // LOG PERFORMANCE
	  console.log('Time taken: '+ (tEnd - tStart) +' milliseconds');

}


// Process for each point (x,y)
// Make this a complex coordinate, c = x + yi
// Run this through the formula f(z) = z^2 + c
// Start with z = 0 for the first iteration, then z = f(z)
// Take the modulo of the result at each iteration
// If this is > 2 then break out - not in the set!
// If this is < 2 then this IS in the set!
// The colour for the point (x,y) is the number of iterations before it broke out
// Black -> never breaks out

// RETURN THE NUMBER OF ITERATIONS IT TOOK TO BREAK FROM THE LIMIT
function mandlebrot(x, y, iterations, limit){

  // GET A NEW COMPLEX NUMBER FROM INPUT (x0, y0)
	let c = new Complex(x, y);
  // GET A ZEROED COMPLEX NUMBER TO START ITERATING
	let z = new Complex(0, 0);
  // COUNT IS THE NUMBER OF ITERATIONS
	let count = 0;
  // START WITH MODULO = 0
  let cMod = 0;

  // DO LOOP ITERATES UNTIL LIMIT BROKEN OR MAX ITERATIONS
  do {
		// CALCULATE Z^2 (z multiplied by z)
		let cResult = z.multiply(z).sub(c)
    cMod = cResult.modulo();
		// SET Z = CMOD
		z = cResult;
    // INCREMENT THE COUNT OF ITERATIONS COMPLETED
		count++;

	} while ( (cMod <= limit) && (count < iterations) );

  // THEN RETURN THE COUNT (HOW LONG IT TOOK TO BREAK THE LIMIT)
	return count;
}

// RETURN THE NUMBER OF ITERATIONS IT TOOK TO BREAK FROM THE LIMIT
function cubicMandlebrot(x, y, iterations, limit){

  // GET A NEW COMPLEX NUMBER FROM INPUT (x0, y0)
	let c = new Complex(x, y);
  // GET A ZEROED COMPLEX NUMBER TO START ITERATING
	let z = new Complex(0, 0);
  // COUNT IS THE NUMBER OF ITERATIONS
	let count = 0;
  // START WITH MODULO = 0
  let cMod = 0;

  // DO LOOP ITERATES UNTIL LIMIT BROKEN OR MAX ITERATIONS
  do {
		// CALCULATE Z^2 (z multiplied by z)
		let cResult = z.multiply(z).multiply(z).sub(c);
    cMod = cResult.modulo();
		// SET Z = CMOD
		z = cResult;
    // INCREMENT THE COUNT OF ITERATIONS COMPLETED
		count++;

	} while ( (cMod <= limit) && (count < iterations) );

  // THEN RETURN THE COUNT (HOW LONG IT TOOK TO BREAK THE LIMIT)
	return count;
}


function julia(x, y, iterations, limit){

  // GET A NEW COMPLEX NUMBER FROM INPUT (x0, y0)
  let c = new Complex(x, y);
  // JULIA USES DIFFERENT NUMBERS TO START ITERATING
  //let z = new Complex(0, -0.8);
  //let z = new Complex(0.7269, -0.1889);
  let z = new Complex(-0.8, 0.156);

  // COUNT IS THE NUMBER OF ITERATIONS
  let count = 0;
  // START WITH MODULO = 0
  let cMod = 0;

  // DO LOOP ITERATES UNTIL LIMIT BROKEN OR MAX ITERATIONS
  do {
    // CALCULATE Z^2 (z multiplied by z)
    let cResult = z.multiply(z).sub(c);

    cMod = cResult.modulo();
    // SET Z = CMOD
    z = cResult;
    // INCREMENT THE COUNT OF ITERATIONS COMPLETED
    count++;

  } while ( (cMod <= limit) && (count < iterations) );

  // THEN RETURN THE COUNT (HOW LONG IT TOOK TO BREAK THE LIMIT)
  return count;

}

// THIS WILL GENERATE A PLOT FROM x0,y0 TO x1,y1
function generateFractal(x0, y0, iterations, limit, type){

  // CALCULATE THE RANGE OF VALUES
  let xRange = RANGE / zoomLevel;
  let yRange = RANGE / zoomLevel;
  // THE MAXIMUM X/Y VALUES
  let xMax = x0 + xRange;
  let yMax = y0 + yRange;
  // THE INCREMENT OF X/Y TO CALCULATE
  let xInc = (xRange / CNV_WIDTH);
  let yInc = (yRange / CNV_HEIGHT);
  //console.log('Range X/Y = ',xRange,yRange);
  //console.log('x0/y0 = ',x0,y0);
  //console.log('xMax/yMax = ',xMax,yMax);
  //console.log('xInc/yInc = ',xInc,yInc);

	// SETUP CANVAS ELEMENT
	let cnv = document.getElementById('fractalCnv');
  // SET THE WIDTH
	cnv.width = CNV_WIDTH;
  // SET THE HEIGHT
	cnv.height = CNV_HEIGHT;
  // GET 2D CONTEXT AND ENSURE NO TRANSPARENCY (FOR EFFICIENCY)
	let ctx = cnv.getContext('2d', { alpha: false });

  // THE xCoord IS THE ACTUAL PIXEL ON THE CANVAS
	let xCoord = 0;

  // LOOP THROUGH ALL X VALUES IN THE RANGE
	for (var x = x0; x < xMax; x = x + xInc){

    // FOR EACH ONE, RESET THE yCoord TO 0
		let yCoord = 0;

    // THEN LOOP THROUGH ALL THE Y VALUES
		for (var y = y0; y < yMax; y = y + yInc){

      // MOVE THE CANVAS PIXEL TO THE NEW COORDINATE
      ctx.moveTo(xCoord, yCoord);

      // i IS THE ITERATIONS FOR THIS POINT
      switch (type){

        case 'mandlebrot':
          i = mandlebrot(x, y, iterations, limit);
          break;

        case 'cubicMandlebrot':
          i = cubicMandlebrot(x, y, iterations, limit);
          break;

        case 'default':
        case 'julia':
          i = julia(x, y, iterations, limit);
          break;

      }




      // USING RGB
			//let col = Math.floor(COL_MAX - (COL_MAX * (i / iterations)));
      //ctx.fillStyle = 'rgb(0, ' + col + ', 0)';

      if (i >= iterations  - 1){
        col = 'rgb(0,0,0)';
      }else{

        if (colourScheme === 'Random'){
          // Scale all colours to count(array_colours)
          let colPoint = Math.floor(maxIterations * (i / iterations));
          col = randomCols[colPoint];
        }else{
          // Scale all colours to count(array_colours)
          let colPoint = Math.floor(maxIterations * (i / iterations));
          col = ARR_COLOURS[colourScheme][colPoint];
        }

      }

      ctx.fillStyle = col;
			ctx.fillRect(xCoord, yCoord, 1, 1);

			//console.log('Point (' + x + ',' + y + ') iterations = ' + i);

			yCoord++;

		}

		xCoord++;

	}

  // ACTUALLY DRAW ON THE CANVAS AT THE END
  ctx.fill();


}

function getRandomColourScheme(){
  var arrCols = [];
  for (var i = 0; i < 16; i++){
    let thisCol = random_rgb();
    arrCols.push(thisCol);
  }
  return arrCols;
}

// Adapted from https://stackoverflow.com/a/23095818
function random_rgb() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}
