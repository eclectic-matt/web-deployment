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
      
      console.log('correct for row',i,'=',this.answers[i],' col',this.grid[i].indexOf(1));
      
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
          this.constraints[i].msg = thisName + ' is in col ' + (thisCol + 1);
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
            //ELSE ABOVE EVERYONE IN ROWS i-(max)
            let otherName = this.answers[this.randomInt(i+1, this.answers.length - 1)];
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
            //BELOW EVERYONE IN ROWS 0-(i-1)
            let otherName = this.answers[this.randomInt(0,i - 1)];
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
            let otherName = this.answers.filter ( (el) => { return el !== thisName})[this.randomInt(0,this.answers.length - 2)];
            this.constraints[i].msg = thisName + ' is left of ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        case 'right':
          if (thisCol == 0) {
            this.constraints[i].msg = thisName + ' is right of no-one';
            this.constraints[i].constraint = 'no-one';
          } else {
            let otherName = this.answers.filter((el) => { return el !== thisName })[this.randomInt(0, this.answers.length - 2)];
            this.constraints[i].msg = thisName + ' is right of ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        default:
          this.constraints[i].msg = thisName + ' has type ' + (thisCol + 1);
          this.constraints[i].constraint = thisCol;
        break;
      }
      //console.log('constraint',i,this.constraints[i]);
      //this.constraints[i] = constraint;
    }
    
    //SHUFFLE CONSTRAINTS LIST
    this.constraints = this.shuffle([...this.constraints]);
    //console.log('origConstraints', this.constraints);
    //this.shuffle(this.constraints);
    //console.log('shufConstraints', this.constraints);
    //console.log(constraintsArr);
    //this.constraints = constraintsArr;
    //console.log('constraints',this.constraints);
    //ASSIGN IDENTIFIERS
    this.identifiers = [];
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
    for(let i = 0; i < this.answers.length; i++){
      let ansTd = document.createElement('td');
      ansTd.id = 'answerDiv' + i;
      ansTd.className = 'answer draggable';
      ansTd.innerHTML = shufAns[i];
      
      let draggable = new Draggable(ansTd, 'move');
      ansRow.appendChild(draggable.element);
    }
    ansTable.appendChild(ansRow);
    el.appendChild(ansTable);
    
    let constraintsHead = document.createElement('h3');
    constraintsHead.innerHTML = 'Constraints (<span id="matchCount">0</span> matches)';
    el.appendChild(constraintsHead);
    
    this.updateConstraintsList();
  }
  
  /**
   * Triggered when an answer is dropped in a grid cell.
   */
  dropEv(row, col, ans)
  {
    console.log('dropEv', row, col, ans);
    //SET GUESS ARRAY
    this.guess[row][col] = ans;
    //console.log('guesses', this.guess);
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
      this.checkConstraints(matchCount);
    }
  }
  
  checkConstraints(matchCount)
  {
    document.getElementById('matchCount').innerHTML = matchCount;
    for(let i = 0; i < this.constraints.length; i++){
      const c = this.constraints[i];
      //console.log('flt',this.guess.flat(2),c.player,this.guess.flat(2).indexOf(c.player));
      //IS PLAYER SELECTED?
      if (this.guess.flat(2).indexOf(c.player) === -1){
        //PLAYER NOT SELECTED AS AN ANSWER
        console.log(c.player + ' is not on the board');
        c.symbol = '?';
        continue;
      }else{
        switch(c.type){
          case 'col':
            //GET PLAYER COL
            if(this.guess[i][c.constraint] == c.player){
              console.log(c.player + ' is in col ' + c.constraint);
              c.symbol = '✔️';
            }else{
              console.log(c.player + ' is NOT in col ' + c.constraint);
              c.symbol = '❌';
            }
          break;
          
          case 'row':
            //GET PLAYER COL
            if(this.guess[c.constraint].indexOf(c.player) !== false){
              console.log(c.player + ' is in row ' + c.constraint);
              c.symbol = '✔️';
            }else{
              console.log(c.player + ' is NOT in row ' + c.constraint);
              c.symbol = '❌';
            }
          break;
          
          case 'above':
            //GET PLAYER ROW
            let guessRow = this.guess.filter( (row) => row.indexOf(c.player) );
            guessRow = this.guess.indexOf(guessRow);
            if(c.constraint === 'no-one'){
              if(guessRow === (this.gridSize - 1)){
                //IN LAST ROW, MATCHES ANYONE
                console.log(c.player + ' is above ' + c.constraint);
                c.symbol = '✔️';
              }else{
                console.log(c.player + ' is NOT above ' + c.constraint);
                c.symbol = '❌';
              }
            }else{
              //GET OTHER ROW
              let oRow = this.guess.filter ( (row) => row.includes(c.constraint));
              oRow = this.guess.indexOf(oRow);
              if(!oRow){
                c.constraint.symbol = '?';
              }else{
                if(guessRow < oRow){
                  console.log(c.player + ' is above ' + c.constraint);
                  c.symbol = '✔️';
                }else{
                  console.log(c.player + ' is NOT above ' + c.constraint);
                  c.symbol = '❌';
                }
              }
            }
          break;
          
          case 'below':
            //GET PLAYER ROW
            let guessBelowRow = this.guess.filter( (row) => row.indexOf(c.player) );
            guessBelowRow = this.guess.indexOf(guessBelowRow);
            if(c.constraint === 'no-one'){
              if(guessBelowRow === 0){
                //IN FIRST ROW
                console.log(c.player + ' is below ' + c.constraint);
                c.symbol = '✔️';
              }else{
                console.log(c.player + ' is NOT above ' + c.constraint);
                c.symbol = '❌';
              }
            }else{
              //GET OTHER ROW
              let oBelowRow = this.guess.filter ( (row) => row.includes(c.constraint));
              oBelowRow = this.guess.indexOf(oBelowRow);
              if(!oBelowRow){
                c.constraint.symbol = '?';
              }else{
                if(guessBelowRow < oBelowRow){
                  console.log(c.player + ' is below ' + c.constraint);
                  c.symbol = '✔️';
                }else{
                  console.log(c.player + ' is NOT below ' + c.constraint);
                  c.symbol = '❌';
                }
              }
            }
          break;
          
        }
      }
    }
    this.updateConstraintsList();
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