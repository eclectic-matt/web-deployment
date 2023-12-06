class Constraints extends MiniGame
{
  constructor(difficulty)
  {
    super(difficulty);
    this.gridSize = difficulty + 2;
    
    //Clue examples:
    // Bob is in row 2
    // Max is in col 3
    // Tom is above Max
    // Liz is left of Tom
    // Sam is below Liz
    // Amy is right of Sam
    //USE THESE TYPES
    this.constraintTypes = ['row','col','above','left','below','right'];
    //MATCH AGAINST THESE
    this.names = ['Bob','Max','Tom','Liz','Sam','Amy','Rod','Zoe','Ken'];
    this.init();
    this.outputGrid();
    //this.showReplayButton();
  }
  
  init()
  {
    //INIT GUESS ARRAY
    this.guess = [];
    for(let i = 0; i < this.gridSize; i++){
      //FILL ROW WITH ZEROES
      this.guess[i] = new Array(this.gridSize).fill(0);
    }
    
    //INIT GRID
    this.grid = [];
    
    //GENERATE THE GRID AS ROWS OF CELLS (A VALUE OF 1 BEING THE CORRECT ANSWER)
    for(let i = 0; i < this.gridSize; i++){
      //FILL ROW WITH ZEROES
      this.grid[i] = new Array(this.gridSize).fill(0);
      //SET A SINGLE ELEMENT TO ONE
      this.grid[i][i] = 1;
    }
    //SHUFFLE THE ROWS 
    this.grid = this.shuffle(this.grid);
    console.log(this.grid);
    this.answers = [];
    
    //GENERATE NAMES (ONE PER ROW)
    for (let i = 0; i < this.gridSize; i++){
      let randomName = this.names.splice(this.randomInt(1, this.names.length - 1),1)[0];
      this.answers.push(randomName);
    }
    //this.answers = this.shuffle(this.answers);
    //console.log(this.answers);
    //this.grid.forEach( (row) => { console.log(row.indexOf(1))});
    
    //GENERATE CONSTRAINTS
    //this.constraints = new Array(this.gridSize).fill({});
    //let constraintsArr = [];
    this.constraints = [];
    this.correct = [];
    for(let i = 0; i < this.gridSize; i++){
      this.correct.push( {
        row: i,
        col: this.grid[i].indexOf(1),
        name: this.answers[i]
      }
      );
    }
    console.log('Correct Answers',this.correct);
    
    for(let i = 0; i < this.gridSize; i++){
      
      //console.log('correct for row',i,'=',this.answers[i],' col',this.grid[i].indexOf(1));
      
      this.constraints[i] = {};
      this.constraints[i].symbol = '';
      let constraintIndex = this.randomInt(0, this.constraints.length - 1);
      this.constraints[i].type = this.constraintTypes.splice(constraintIndex, 1)[0];
      let thisName = this.answers[i];
      let thisType = this.constraints[i].type;
      let thisCol = this.grid[i].indexOf(1);
      let thisRow = i;
      this.constraints[i].player = thisName;
      this.constraints[i].type = thisType;
      
      switch (thisType){
        
        case 'col':
          //DISPLAY MESSAGE (NOTE FRIENDLY 1-INDEX COLUMN)
          this.constraints[i].msg = thisName + ' is in column ' + (thisCol + 1);
          this.constraints[i].constraint = thisCol;
        break;
        
        case 'row':
          this.constraints[i].msg = thisName + ' is in row ' + (thisRow + 1);
          this.constraints[i].constraint = thisRow;
        break;
        
        case 'above':
          //ROW max - ABOVE NO-ONE
          if(i == (this.gridSize - 1)){
            this.constraints[i].msg = thisName + ' is above no-one';
            this.constraints[i].constraint = 'no-one';
          }else{
            //let thisCorrect = this.correct.filter( (ans) => { return ans.name == thisName});
            let validAnswers = this.correct.filter( (ans) => { return ans.row > i; });
            let otherName = validAnswers[this.randomInt(0, validAnswers.length - 1)].name;
            this.constraints[i].msg = thisName + ' is above ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        
        case 'below':
          //ROW 0 - BELOW NO-ONE
          if(i == 0){
            this.constraints[i].msg = thisName + ' is below no-one';
            this.constraints[i].constraint = 'no-one';
          }else{
            let validAnswers = this.correct.filter( (ans) => { return ans.row < i; });
            let otherName = validAnswers[this.randomInt(0, validAnswers.length - 1)].name;
            
            this.constraints[i].msg = thisName + ' is below ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        
        case 'left':
          //
          if(thisCol == (this.gridSize - 1)){
            this.constraints[i].msg = thisName + ' is left of no-one';
            this.constraints[i].constraint = 'no-one';
          }else{
            let validAnswers = this.correct.filter( (ans) => { return ans.col > thisCol; });
            let otherName = validAnswers[this.randomInt(0, validAnswers.length - 1)].name;
            this.constraints[i].msg = thisName + ' is left of ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        
        case 'right':
          if (thisCol == 0) {
            this.constraints[i].msg = thisName + ' is right of no-one';
            this.constraints[i].constraint = 'no-one';
          }else{
            //let thisCorrect = this.correct.filter( (ans) => { return ans.name == thisName});
            let validAnswers = this.correct.filter( (ans) => { return ans.col < thisCol; });
            let otherName = validAnswers[this.randomInt(0, validAnswers.length - 1)].name;
            this.constraints[i].msg = thisName + ' is right of ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        
        default:
          this.constraints[i].msg = thisName + ' has type ' + (thisCol + 1);
          this.constraints[i].constraint = thisCol;
        break;
        
      }
    }
    
    //SHUFFLE CONSTRAINTS LIST
    this.constraints = this.shuffle([...this.constraints]);
   
    //ADD 1 PER ROW CONDITION
    let rowCon = {};
    rowCon.player = 'no-one';
    rowCon.constraint = 'per row';
    rowCon.type = 'onePerRow';
    rowCon.msg = '1 player per row';
    rowCon.name = 'no-one';
    rowCon.symbol = '';
    this.constraints.push(rowCon);
    
    //ADD 1 PER COL CONDITION
    let colCon = {};
    colCon.player = 'no-one';
    colCon.constraint = 'per col';
    colCon.type = 'onePerCol';
    colCon.msg = '1 player per col';
    colCon.name = 'no-one';
    colCon.symbol = '';
    this.constraints.push(colCon);
  }
  
  outputGrid()
  {
    let el = document.getElementById('main');
    document.getElementById('form').style.display = 'none';
    let table = document.createElement('table');
    //HEAD ROW
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    th.innerHTML = '';
    tr.appendChild(th);
    for(let i = 0; i < this.gridSize; i++){
      let th = document.createElement('th');
      th.innerHTML = (i + 1);
      tr.appendChild(th);
    }
    table.appendChild(tr);
    for(let i = 0; i < this.gridSize; i++){
      let row = document.createElement('tr');
      for(let j = -1; j < this.gridSize; j++){
        let td = document.createElement('td');
        if(j==-1){
          td.innerHTML = '<b>' + (i + 1) + '</b>';
          row.appendChild(td);
        }else{
          //Droppable Area
          td.style.border = '1px solid black';
          td.style.backgroundColor = '#555';
          td.setAttribute('i', i);
          td.setAttribute('j', j);
          td.className = 'target';
          let dropEv = this.dropEv;
          let droppable = new DropZone(td, 'move', dropEv)
          row.appendChild(droppable.element);
        }
      }
      table.appendChild(row);
    }
    el.appendChild(table);
    
    //Spread to get copy of answers (do not shuffle original)
    let shufAns = this.shuffle([...this.answers]);
    console.log('shufAnswers',shufAns);
    let ansTable = document.createElement('div');
    let ansRow = document.createElement('tr');
    ansRow.style.width = '100%';
    for(let i = 0; i < this.answers.length; i++){
      let ansTd = document.createElement('td');
      ansTd.id = 'answerDiv' + i;
      ansTd.className = 'answer draggable';
      ansTd.innerHTML = shufAns[i];
      ansTd.style.width = '25%';
      let draggable = new Draggable(ansTd, 'move');
      ansRow.appendChild(draggable.element);
    }
    ansTable.appendChild(ansRow);
    el.appendChild(ansTable);
    
    let constraintsHead = document.createElement('b');
    constraintsHead.innerHTML = 'Constraints (<span id="matchCount">0</span> out of ' + this.constraints.length + ')';
    el.appendChild(constraintsHead);
    
    this.updateConstraintsList();
  }
  
  /**
   * Triggered when an answer is dropped in a grid cell.
   */
  dropEv(row, col, ans)
  {
    console.log('dropEv', row, col, ans);
    //console.log('guesses', this.guess);
    
    //REMOVE GUESS FROM PREVIOUS
    for(let i = 0; i < this.guess.length; i++){
      for(let j = 0; j < this.guess[i].length; j++){
        if(this.guess[i][j] == ans){
          //CLEAR PREVIOUS
          this.guess[i][j] = 0;
        }
      }
    }
    
    //SET GUESS ARRAY
    this.guess[row][col] = ans;
    
    //CHECK GUESSES
    this.checkGuesses();
  }
  
  checkGuesses()
  {
    let matchCount = 0;
    
    //filter to only available rows?
    for(let i = 0; i < this.guess.length; i++){
      
      for(let j = 0; j < this.guess[i].length; j++){
        
        //if no guess to check, continue
        if(this.guess[i][j] == 0) continue;
        
        if(
          //This answer is correct for this row
          (this.guess[i][j] === this.answers[i]) && 
          //This column is correct for this row
          (this.grid[i].indexOf(1) === j) 
        ){
          console.log('Match - ',this.guess[i][j],i,j);
          matchCount++;
        }
      }
    }
    console.log('Correct Count',matchCount);
    
    if(matchCount == this.answers.length){
      this.win();
    }else{
      this.checkConstraints();
    }
  }
  
  checkConstraints()
  {
    //document.getElementById('matchCount').innerHTML = matchCount;
    let matchCount = 0;
    for(let i = 0; i < this.constraints.length; i++){
      const c = this.constraints[i];
      //IS PLAYER SELECTED?
      if( (c.player !== 'no-one') && (this.guess.flat().indexOf(c.player) == -1) ){
        //PLAYER NOT SELECTED AS AN ANSWER
        console.log(c.player + ' is not on the board');
        c.symbol = '?';
        continue;
      }else{
        switch(c.type){
          
          case 'col':
            let colIndex = this.getGuessColIndex(c.player);
            /*let colIndex = -1;
            //GET PLAYER COL
            for(let i = 0; i < this.guess.length; i++){
              for(let j = 0; j < this.guess[i].length; j++){
                if(this.guess[i][j] == c.player){
                  colIndex = j;
                  //break;
                }
              }
            }*/
            //console.log('col',c.player,colIndex,this.guess);
            if(colIndex == -1){
              c.symbol = '?';
            }else{
              if(colIndex === c.constraint){
                c.symbol = '✔️';
                matchCount++;
              }else{
                c.symbol = '❌';
              }
            }
          break;
          
          case 'row':
            let pRow = this.guess[c.constraint].indexOf(c.player);
            console.log('row',c.constraint,c.player,pRow);
            //GET PLAYER COL
            if(pRow != -1){
              console.log(c.player + ' is in row ' + c.constraint);
              c.symbol = '✔️';
              matchCount++;
            }else{
              console.log(c.player + ' is NOT in row ' + c.constraint);
              c.symbol = '❌';
            }
          break;
          
          case 'above':
            //GET PLAYER ROW
            /*let guessRowArr = this.guess.filter( (row) => { return row.indexOf(c.player) != -1; });
            let guessRow = this.guess.indexOf(guessRowArr);
            console.log('above', guessRowArr, guessRow);*/
            let guessRow = this.getGuessRowIndex(c.player);
            //IF THIS CONSTRAINT'S PLAYER IS NOT IN ANY ROW
            if(guessRow == -1){
              c.symbol = '?';
              break;
            }
            //CHECK IF CONSTRAINT IS FOR NO-ONE 
            if(c.constraint === 'no-one'){
              //IF THIS IS IN THE LAST ROW (ABOVE NO-ONE = BELOW EVERYONE)
              if(guessRow === (this.gridSize - 1)){
                //IN LAST ROW, MATCHES ANYONE
                //console.log(c.player + ' is above ' + c.constraint);
                c.symbol = '✔️';
                matchCount++;
                break;
              }else{
                //console.log(c.player + ' is NOT above ' + c.constraint);
                c.symbol = '❌';
                break;
              }
            }
            //NOT "NO-ONE" SO GET OTHER ROW
            //let oRow = this.guess.filter ( (row) => { return row.indexOf(c.constraint) != -1; });
            //oRow = this.guess.indexOf(oRow);
            let oRow = this.getGuessRowIndex(c.constraint);
            console.log('above', c.player, guessRow, c.contraint, oRow);
            if(oRow === -1){
              c.symbol = '?';
              break;
            }else{
              //IS ABOVE (LOWER) THAN OTHER PLAYER ROW?
              if(guessRow < oRow){
                //console.log(c.player + ' is above ' + c.constraint);
                c.symbol = '✔️';
                matchCount++;
                break;
              }else{
                //console.log(c.player + ' is NOT above ' + c.constraint);
                c.symbol = '❌';
                break;
              }
            }
          break;
          
          case 'below':
            //GET PLAYER ROW
            //let guessBelowRow = this.guess.filter( (row) => { return row.indexOf(c.player) != -1 } );
            //guessBelowRow = this.guess.indexOf(guessBelowRow);
            let guessBelowRow = this.getGuessRowIndex(c.player);
            //IF THERE IS NO MATCHING ROW
            if(guessBelowRow === -1){
              //c.player NOT ON BOARD - CANNOT VALIDATE
              c.symbol = '?';
              break;
            }
            //IF CONSTRAINT IS BELOW NO-ONE (ABOVE EVERYONE)
            if(c.constraint === 'no-one'){
              //WILL ONLY VALIDATE IF ON FIRST ROW (STRICTLY SHOULD VALIDATE AGAINST OTHER PLAYERS POSITIONS, BUT THIS RESULTS IN A VALID CONSTRAINT OVERALLL)
              if(guessBelowRow === 0){
                //IN FIRST ROW
                c.symbol = '✔️';
                matchCount++;
                break;
              }else{
                //NOT FIRST ROW, SOMEONE IS ABOVE THEM
                c.symbol = '❌';
                break;
              }
            }
            //NOT "NO-ONE" SO GET OTHER ROW
            //let oBelowRow = this.guess.filter ( (row) => { return row.indexOf(c.constraint) != -1 });
            //oBelowRow = this.guess.indexOf(oBelowRow);
            let oBelowRow = this.getGuessRowIndex(c.constraint);
            //IF THERE WAS NO MATCHING ROW
            if(oBelowRow === -1){
              //c.constraint IS NOT ON THE BOARD - CANNOT VALIDATE
              c.symbol = '?';
              break;
            }
            //IF THE GUESS ROW IS GREATER THAN (BELOW) THE CONSTRAINT ROW
            if(guessBelowRow > oBelowRow){
              c.symbol = '✔️';
              matchCount++;
              break;
            }else{
              c.symbol = '❌';
              break;
            }
          break;
          
          case 'left':
            //GET THIS CONSTRAINT COL
            let leftP = this.getGuessColIndex(c.player);
            if(leftP == -1){
              c.symbol = '?';
              break;
            }
            //CHECK NO-ONE
            if(c.constraint == 'no-one'){
              if(leftP == (this.guess[0].length - 1)){
                c.symbol = '✔️';
                matchCount++;
                break;
              }else{
                //CHECK LOWEST GUESS COL?
                let minCol = this.getGuessMinColIndex();
                if(minCol == -1){
                  c.symbol = '?';
                  break;
                }else{
                  if(minCol >= leftP){
                    c.symbol = '✔️';
                    matchCount++;
                    break;
                  }else{
                    c.symbol = '❌';
                    break;
                  }
                }
              }
            }
            //NOT NO-ONE, GET OTHER COL
            let leftO = this.getGuessColIndex(c.constraint);
            console.log('left',c.player,leftP,c.constraint,leftO);
            if(leftP < leftO){
              c.symbol = '✔️';
              matchCount++;
            }else{
              c.symbol = '❌';
            }
          break;
            
          case 'right':
            //GET THIS CONSTRAINT COL
            let rightP = this.getGuessColIndex(c.player);
            if(rightP === -1){
              //PLAYER NOT ON BOARD
              c.symbol = '?';
              break;
            }
            //CHECK NO-ONE AND FAR LEFT
            if( (c.constraint == 'no-one') && (rightP === 0) ){
              c.symbol = '✔️';
              matchCount++;
              break;
            }
            //GET LARGEST COLUMN
            let maxCol = this.getGuessMaxColIndex();
            if ((c.constraint == 'no-one') && (rightP >= maxCol) ){
              c.symbol = '✔️';
              matchCount++;
              break;
            }
            //IF CONSTRAINT IS FOR RIGHT OF NO-ONE AND PLAYER COLUMN IS SMALLER THAN THE MAX COLUMN
            if( (c.constraint == 'no-one') && (rightP < maxCol) ){
                c.symbol = '❌';
                break;
            }
            //GET THE OTHER PLAYER (NOT NO-ONE)
            let rightO = this.getGuessColIndex(c.constraint);
            if(leftP < rightO){
              c.symbol = '✔️';
              matchCount++;
            }else{
              c.symbol = '❌';
            }
          break;
          
          case 'onePerRow':
            let rowValid = true;
            for(let i = 0; i < this.guess.length; i++){
              let rowCount = this.guess[i].filter( (el) => {return el != 0; }).length;
              if(rowCount !== 1){
                rowValid = false;
              }
            }
            if(rowValid === false){
              c.symbol = '❌';
            }else{
              c.symbol = '✔️';
              matchCount++;
            }
          break;
          
          case 'onePerCol':
            let colValid = true;
            for(let i = 0; i < this.guess.length; i++){
              let column = this.guess.map( (value, index) => { return value[i]; });
              let colCount = column.filter( (el) => { return el != 0; }).length;
              if(colCount !== 1){
                colValid = false;
              }
            }
            if(colValid === false){
              c.symbol = '❌';
            }else{
              c.symbol = '✔️';
              matchCount++;
            }
          break;
        }
      }
      document.getElementById('matchCount').innerHTML = matchCount;
      if(matchCount === this.constraints.length){
        this.updateConstraintsList();
        this.win();
      }
    }
    
    this.updateConstraintsList();
  }
  
  
  /**
   * Get the column index (ignoring row) for a player within the guess array.
   * @param string player The player to search for.
   * @return int The column index of the selected player (or -1 if not found).
   */
  getGuessColIndex(player)
  {
    /*console.log('guessCol',this.guess.filter( (row) => { return row.indexOf(player) != -1; }), this.guess.filter( (row) => { return row.indexOf(player) != -1; }).indexOf(player));
    return this.guess.filter( (row) => { return row.indexOf(player) != -1; }).indexOf(player);*/
    for(let i=0; i< this.guess.length; i++){
      if(this.guess[i].includes(player)){
        return this.guess[i].indexOf(player);
      }
    }
    return -1;
  }
  
  getGuessRowIndex(player)
  {
    for(let i = 0; i < this.guess.length; i++){
      if(this.guess[i].includes(player)){
        return i;
      }
    }
    return -1;
  }
  
  /**
   * Get the minimum (lowest) column index containing a guess.
   * @return int The minimum column index (or -1 if none found).
   */
  getGuessMinColIndex()
  {
    let minCol = this.gridSize;
    for(let i = 0; i < this.guess.length; i++){
      for(let j = 0; j < this.guess[i].length; j++){
        if( (this.guess[i][j] != 0) && (j < minCol) ){
          minCol = j;
        }
      }
    }
    console.log('minCol',minCol,this.guess);
    return (minCol === this.gridSize ? -1 : minCol);
  }
  
  /**
   * Get the maximum (largest) column index containing a guess.
   * @return int the maximum column index (or -1 if none found).
   */
  getGuessMaxColIndex()
  {
    let maxCol = -1;
    for(let i = 0; i < this.guess.length; i++){
      for(let j = 0; j < this.guess[i].length; j++){
        if( (this.guess[i][j] != 0) && (j > maxCol) ){
          maxCol = j;
        }
      }
    }
    console.log('maxCol',maxCol,this.guess);
    return maxCol;
  }
  
  updateConstraintsList()
  {
    let el = document.getElementById('main');
    let ul;
    
    if(!document.getElementById('constraintsList')){
      ul = document.createElement('ul');
      ul.id = 'constraintsList';
    }else{
      ul = document.getElementById('constraintsList');
      el.removeChild(ul);
      ul.innerHTML = '';
    }
    
    for(let i = 0; i < this.constraints.length; i++){
      let li = document.createElement('li');
      li.innerHTML = this.constraints[i].msg + ' ' + this.constraints[i].symbol;
      li.style.fontSize = '0.5rem';
      li.setAttribute('draggable',false);
      ul.appendChild(li);
    }
    
    el.appendChild(ul);
  }
}