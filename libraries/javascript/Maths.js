class Maths
{
	
	constructor(){

	}

	/**
	 * Get the angle and distance between point A and point B.
	 * @param {float} xa The x coordinate for point A.
	 * @param {float} ya The y coordinate for point A.
	 * @param {float} xb The x coordinate for point B.
	 * @param {float} yb The y coordinate for point B.
	 * @return {object} An object containing the distance and angle.
	 */
	getAngleAndDistance(xa, ya, xb, yb)
	{
		const distance = this.getDistance(xa, ya, xb, yb);
		const angle = this.getAngle(x, y);
		return { distance: distance, angle: angle };
	}

	getDistance(xa, ya, xb, yb)
	{
		const xDist = Math.abs(xb - xa);
		const yDist = Math.abs(yb - ya);
		// (a2 + b2 = c2), c2 = a2 + b2, c = root(a2 + b2)
		return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
	}

	getAngle(xa, ya, xb, yb)
	{
		return Math.atan2(yb - ya, xb - xa) * 180 / Math.PI + 180;
	}

	matrixMultiply(matrixA, matrixB){
		//CHECK DIMENSIONS ARE COMPATIBLE
		if(matrixA.columns != matrixB.rows) return false;

		
	}
}

function Complex(real, imaginary) {
	this.real = real;
	this.imaginary = imaginary;
  }
  
  Complex.prototype.print = function() {
  
	  let sign = '';
  
	  if (this.imaginary > 0){
		  sign = '+';
	  }
  
	return this.real + " " + sign + ' ' + this.imaginary + "i";
  };
  
  Complex.prototype.add = function(c2){
	  var r = this.real + c2.real;
	  var i = this.imaginary + c2.imaginary;
	  return new Complex(r, i);
  }
  
  Complex.prototype.sub = function(c2){
	  var r = this.real - c2.real;
	  var i = this.imaginary - c2.imaginary;
	  return new Complex(r,i);
  }
  
  Complex.prototype.multiply = function(c2){
	  var r = (this.real * c2.real) - (this.imaginary * c2.imaginary);
	  var i = (this.real * c2.imaginary) + (c2.real * this.imaginary);
	  return new Complex(r, i);
  }
  
  Complex.prototype.divide = function(c2){
	  var rA = (this.real * c2.real) + (this.imaginary * c2.imaginary);
	  var i = (this.imaginary * c2.real) - (this.real * c2.imaginary);
	  var rB = (c2.real * c2.real) + (c2.imaginary * c2.imaginary);
	  return new Complex(rA / rB, i / rB);
  }
  
  Complex.prototype.modulo = function(){
	  var r = (this.real * this.real) + (this.imaginary * this.imaginary)
	  return Math.sqrt(r);
  }
  
  
  /*
   * Complex addition = (a+bi)+(c+di)=(a+c)+i(b+d),
   * complex subtraction = (a+bi)-(c+di)=(a-c)+i(b-d)
   * complex multiplication = (a+bi)(c+di)=(ac-bd)+i(ad+bc)
   * complex division = (a+bi)/(c+di)=((ac+bd)+i(bc-ad))/(c^2+d^2)
  */
  