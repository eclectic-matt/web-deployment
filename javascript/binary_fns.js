/*

  REFERENCE
  ---------

  Format: a << b

  <<      Bitwise left shift operator
  Add 0s from the RIGHT and move the bits from "a" LEFT for "b" spaces

  >>      Bitwise right shift operator.
  Add 0s from the LEFT and move bits from "a" RIGHT for "b" spaces

  >>>     Bitwise unsigned right shift operator.
  Add 0s moving right but return unsigned (always positive)

  &       Bitwise AND.
  Return only the bits in a AND b which are the same

  |       Bitwise OR.
  Return bits present in a OR b (or both)

  ^       Bitwise XOR.
  Return bits present in a OR b (and not if both)

  &&      Logical AND.
  Return true only if a and b true

  ||      Logical OR.
  Return true if a OR b true

  ??      Nullish Coalescing Operator.
  Returns a UNLESS it is null or undefined, then returns b


*/

const MAX_INDEX = 53;

function dec_to_bin(dec, desc = false){

  if (dec > Math.pow(2, MAX_INDEX)){

    throw "Decimal number too big to convert! Max integer: " + Math.pow(2, MAX_INDEX);

  }else{

    let out_bin = "";
    let out_text = "";

    for (let i = MAX_INDEX; i >= 0; i--){

      if (dec >= Math.pow(2, i)){
        //console.log("Current value left: ",dec,"so subtract ",Math.pow(2, i)," which is 2^"+i);
        out_bin += "1";
        dec -= Math.pow(2, i);
        if (out_text !== ""){
          out_text += " + 2^" + i;
        }else{
          out_text = "2^" + i;
        }
      }else{
        if (out_bin !== ""){
          out_bin += "0";
        }
      }

    }

    if (!desc){
      return out_bin;
    }else{
      return out_bin + " (" + out_text + ")";
    }


  }

}

const ALPHAS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//console.log(dec_to_bin(9007199254740990));
//console.log(dec_convert(9007199254740990));
console.log(dec_convert(100,2,true));
console.log(dec_convert(100,8,true));
console.log(dec_convert(100,16,true));

function dec_convert(dec, base = 2, desc = false){

  if (dec > Math.pow(2, MAX_INDEX)){

    throw "Decimal number too big! Max integer: " + (Math.pow(2, MAX_INDEX) - 1);
    return false;

  }else if ( (base >= ALPHAS.length) || (base < 2) ){

    throw "Base number cannot convert! Legal values: 2 - " + ALPHAS.length;
    return false;

  }else{

    let out_value = "";
    let out_text = "";

    for (let i = MAX_INDEX; i >= 0; i--){

      if (dec >= Math.pow(base, i)){

        console.log("Current value left: ",dec,"so subtract ",Math.pow(base, i)," which is " + base + "^"+i);
        out_value += ALPHAS[base - 1];
        dec -= Math.pow(base, i);

        if (out_text !== ""){

          if (i === 0){

            out_text += " + " + dec + "*" + base + "^" + i;

          }else{

            out_text += " + " + base + "^" + i;

          }

        }else{

          out_text = base + "^" + i;

        }

      }else{

        if (out_value !== ""){

          out_value += "0";

        }
      }

    }

    if (!desc){

      return out_value;

    }else{

      return out_value + " (" + out_text + ")";

    }

  }

}
