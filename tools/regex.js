const chars = [ ' ', 'A', 'D', 'E' ];

const width = 7;
const height = 2;

let rules = {
  //MUST BE OF LENGTH "height"
  left: [
    /[^RT].[^ICY|H].+[^B-Z](X|J|G)/,
    /[TREE]{2}\s.*/
  ],
  //MUSY BE OF LENGTH "height"
  right: [
    /([A-T])\D[CHILLY]?(R|S)\1.*/,
    /(.)[RED NOSE]+\1(.)\2/
  ],
  //MUST BE OF LENGTH "width"
  top: [
    /[R-Z].?[E]{0}/,
    /[\s\d][CARAMeL]/,
    /[^*.'+SNOW!]\s|\d/,
    /[RUDOLPH]+/,
    /[SLEIGH]+/,
    /[WRAP]*/,
    /[^JINGLE]*/
  ],
  //MUST BE OF LENGTH "width"
  bottom: [
    /.[EGG][NOG]?/,
    ,
    ,
    /[NORTH][POLE]/,
    /.(E|L|V|E|S)/,
    /.[^WREATH]/,
    
  ]
}


function init(){
  
  let results = [];
  
  for(let row = 0; row < height; row++){
    
    results[row] = [];
    
    for(let col = 0; col < width; col++){
      
      results[row][col] = [];
      console.log(results);
      
      //GET THE RULES WHICH APPLY TO THIS CELL
      let thisRules = [ rules.left[row], rules.right[row], rules.top[col], rules.bottom[col] ];
      
      for(let cIndex = 0; cIndex < chars.length; cIndex++){
        
        let char = chars[cIndex];
        let valid = true;
        
        for(pattern = 0; pattern < thisRules.length; pattern++){
          
          let thisRule = thisRules[pattern];
          //BLANK PATTERN?
          if(!thisRule){
            continue;
          }
          
          //CHECK HOW MANY CHARS THIS PATTERN EXPECTS
          let patternLen = 0;
          
          for(let i = 0; i < 10; i++){
            
            let wild = '?'.repeat(i);
            if(thisRule.test(wild) === true){
              //console.log(thisRule,'matches a min of',i,'chars');
              patternLen = i;
              break;
            }
          }
          
          if(patternLen > 1){
            char += '?'.repeat(patternLen - 1);
          }
          console.log(thisRule, patternLen, char, thisRule.test(char));
          if(thisRule.test(char) === false){
            valid = false;
          }
          
        }
        
        if(valid === true){
          results[row][col].push(char);
        }
        
      }
    }
  }
  
  console.log(results);
  
  let table = document.createElement('table');
  let topRow = document.createElement('tr');
  topRow.style.height = '5rem';
  let blankTd1 = document.createElement('td');
  blankTd1.innerHTML='&nbsp;';
  //blankTd1.innerHTML='BLANK';
  topRow.appendChild(blankTd1);
  //OUTPUT TOP ROW
  for(i = 0; i < width; i++){
    let headTD = document.createElement('td');
    headTD.innerHTML = rules.top[i];
    headTD.style.transform = 'rotate(-90deg)';
    topRow.appendChild(headTD);
  }
  let blankTd2 = document.createElement('td');
  blankTd2.innerHTML='&nbsp;';
  //blankTd2.innerHTML = 'BLANK';
  topRow.appendChild(blankTd2);
  table.appendChild(topRow);
  
  for(let row = 0; row < height; row++){
    let tr = document.createElement('tr');
    
    //ADD LEFT RULE
    let leftTD = document.createElement('td');
    leftTD.innerHTML = rules.left[row];
    tr.appendChild(leftTD);
    
    for(let col = 0; col < width; col++){
      let td = document.createElement('td');
      td.innerHTML = results[row][col].join(',');
      tr.appendChild(td);
    }
    
    //ADD LEFT RULE
    let rightTD = document.createElement('td');
    rightTD.innerHTML = rules.right[row];
    tr.appendChild(rightTD);
        
    table.appendChild(tr);
  }
  
  let btmRow = document.createElement('tr');
  btmRow.style.height = '5rem';
  let blankTd3 = document.createElement('td');
  blankTd3.innerHTML='&nbsp;';
  //blankTd1.innerHTML='BLANK';
  btmRow.appendChild(blankTd3);
  for(let col = 0; col < width; col++){
      let td = document.createElement('td');
      td.style.transform = 'rotate(-90deg)';
      td.innerHTML = rules.bottom[col];
      btmRow.appendChild(td);
  }
  let blankTd4 = document.createElement('td');
  blankTd4.innerHTML = '&nbsp;';
  //blankTd1.innerHTML='BLANK';
  btmRow.appendChild(blankTd4);
  table.appendChild(btmRow);
  
  document.getElementById('main').appendChild(table);

}