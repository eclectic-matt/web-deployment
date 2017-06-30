<?php

echo "The formula is as follows (from https://en.wikipedia.org/wiki/Bailey–Borwein–Plouffe_formula)";

echo "$PI = Sum{K=0 -> Infinity} [ 1 / 16^K * ( 4 / 8K + 1 ) - ( 2 / 8K + 4 ) - ( 1 / 8K + 5 ) - ( 1 / 8K + 6) ]";

$limit = 100;
$piVal = 0;

for ($k = 0; $k < $limit; $k++){
  $piVal +=  (1 / (16 ^ $k) * (4 / ((8 * $k) + 1) - (2 / ((8 * $k) + 4)  - ( 1 / (8 * $k) + 5) - (1 / (8 * $k) + 6) )))
}
                         
echo "PI calc: " . $piVal;

?>
