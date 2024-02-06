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
}