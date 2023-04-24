/*
function julia(x, y, iterations, limit, indices){

  // GET A NEW COMPLEX NUMBER FROM INPUT (x0, y0)
  let c = new Complex(x, y);
  // JULIA USES DIFFERENT NUMBERS TO START ITERATING
  //let z = new Complex(0, -0.8);
  //let z = new Complex(0.7269, -0.1889);
  //let z = new Complex(-0.8, 0.156);
  //let z = new Complex(0.6, 0.55);
  let z = new Complex(0.8, 0.6);
  //let z = new Complex(0, 0);

  // COUNT IS THE NUMBER OF ITERATIONS
  let count = 0;
  // START WITH MODULO = 0
  let cMod = 0;

  // DO LOOP ITERATES UNTIL LIMIT BROKEN OR MAX ITERATIONS
  do {
    // CALCULATE Z^2 (z multiplied by z)
    //let cResult = z.multiply(z).divide(c);
    //let cResult = z.multiply(z).multiply(z).multiply(z).multiply(z).add(c);
    let cResult = z.multiply(z).add(c);

    /*
    //z - ((z3 - 1)/3z2)
    let cA = z.multiply(z).multiply(z);
    let justOne = new Complex(1,0);
    let cB = cA.sub(justOne);
    let justThree = new Complex(3,0);
    let cC = z.multiply(z).multiply(justThree);
    let cResult = cB.divide(cC);
    */

    cMod = cResult.modulo();
    // SET Z = CMOD
    z = cResult;
    // INCREMENT THE COUNT OF ITERATIONS COMPLETED
    count++;

  } while ( (cMod <= limit) && (count < iterations) );

  // THEN RETURN THE COUNT (HOW LONG IT TOOK TO BREAK THE LIMIT)
  return count;

}
*/
