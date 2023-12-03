class Constraints extends MiniGame
{
  constructor(difficulty){
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
    this.showReplayButton();
  }
  
  init(){
    //INIT GUESS ARRAY
    this.guess = [];
    for(let i = 0; i < this.gridSize; i++){
      //FILL ROW WITH ZEROES
      this.guess[i] = new Array(this.gridSize).fill(0);
    }
    
    //INIT GRID
    this.grid = [];
    /*
    for(let i = 0; i < 100; i++){
      console.log(i,this.randomInt(0,i));
    }
    */
    
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
    console.log(this.answers);
    this.grid.forEach( (row) => { console.log(row.indexOf(1))});
    
    //GENERATE CONSTRAINTS
    //this.constraints = new Array(this.gridSize).fill({});
    //let constraintsArr = [];
    this.constraints = [];
    
    for(let i = 0; i < this.gridSize; i++){
      
      this.constraints[i] = {};
      this.constraints[i].symbol = '';
      let constraintIndex = this.randomInt(0, this.constraints.length - 1);
      this.constraints[i].type = this.constraintTypes.splice(constraintIndex, 1)[0];
      //console.log(constraint[0], this.answers[i], this.constraints[i]);
      let thisName = this.answers[i];
      let thisType = this.constraints[i].type;
      let thisCol = this.grid[i].indexOf(1);
      let thisRow = i;
      
      switch (thisType){
        case 'col':
          //DISPLAY MESSAGE (NOTE FRIENDLY 1-INDEX COLUMN)
          //this.constraints[i].msg = thisName + ' is in col ' + (thisCol+1);
          //constraintsArr.push(thisName + ' is in col ' + (thisCol+1));
          this.constraints[i].player = thisName;
          this.constraints[i].type = thisType;
          this.constraints[i].msg = thisName + ' is in col ' + (thisCol + 1);
          this.constraints[i].constraint = thisCol;
        break;
        case 'row':
          //this.constraints[i].msg = thisName + ' is in row ' + (i+1);
          //constraintsArr.push(thisName + ' is in row ' + (i+1));
          this.constraints[i].player = thisName;
          this.constraints[i].type = thisType;
          this.constraints[i].msg = thisName + ' is in row ' + (thisRow + 1);
          this.constraints[i].constraint = thisRow;
        break;
        case 'above':
          //ROW max - ABOVE NO-ONE
          if(i == (this.gridSize - 1)){
            //this.constraints[i].msg = thisName + ' is above no-one';
            //constraintsArr.push(thisName + ' is above no-one');
            this.constraints[i].player = thisName;
            this.constraints[i].type = thisType;
            this.constraints[i].msg = thisName + ' is above no-one';
            this.constraints[i].constraint = 'no-one';
          }else{
            //ELSE ABOVE EVERYONE IN ROWS i-(max)
            let otherName = this.answers[this.randomInt(i+1, this.answers.length - 1)];
            //this.constraints[i].msg = thisName + ' is above ' + otherName;
            //constraintsArr.push(thisName + ' is above ' + otherName);
            this.constraints[i].player = thisName;
            this.constraints[i].type = thisType;
            this.constraints[i].msg = thisName + ' is above ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        case 'below':
          //ROW 0 - BELOW NO-ONE
          if(i == 0){
            //this.constraints[i].msg = thisName + ' is below no-one';
            //constraintsArr.push(thisName + ' is below no-one');
            this.constraints[i].player = thisName;
            this.constraints[i].type = thisType;
            this.constraints[i].msg = thisName + ' is below no-one';
            this.constraints[i].constraint = 'no-one';
          }else{
            //BELOW EVERYONE IN ROWS 0-(i-1)
            let otherName = this.answers[this.randomInt(0,i - 1)];
            //this.constraints[i].msg = thisName + ' is below ' + otherName;
            //constraintsArr.push(thisName + ' is below ' + otherName);
            this.constraints[i].player = thisName;
            this.constraints[i].type = thisType;
            this.constraints[i].msg = thisName + ' is below ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        case 'left':
          //
          if(thisCol == (this.gridSize - 1)){
            //constraintsArr.push(thisName + ' is left of no-one');
            this.constraints[i].player = thisName;
            this.constraints[i].type = thisType;
            this.constraints[i].msg = thisName + ' is left of no-one';
            this.constraints[i].constraint = 'no-one';
          }else{
            let otherName = this.answers.filter ( (el) => { return el !== thisName})[this.randomInt(0,this.answers.length - 2)];
            //constraintsArr.push(thisName + ' is left of ' + otherName);
            this.constraints[i].player = thisName;
            this.constraints[i].type = thisType;
            this.constraints[i].msg = thisName + ' is left of ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        case 'right':
          if (thisCol == 0) {
            //constraintsArr.push(thisName + ' is right of no-one');
            this.constraints[i].player = thisName;
            this.constraints[i].type = thisType;
            this.constraints[i].msg = thisName + ' is right of no-one';
            this.constraints[i].constraint = 'no-one';
          } else {
            let otherName = this.answers.filter((el) => { return el !== thisName })[this.randomInt(0, this.answers.length - 2)];
            //constraintsArr.push(thisName + ' is right of ' + otherName);
            this.constraints[i].player = thisName;
            this.constraints[i].type = thisType;
            this.constraints[i].msg = thisName + ' is right of ' + otherName;
            this.constraints[i].constraint = otherName;
          }
        break;
        default:
          //this.constraints[i].msg = thisName + ' has constraint ' + thisType;
          //constraintsArr.push(thisName + ' has type ' + thisType);
          this.constraints[i].player = thisName;
          this.constraints[i].type = thisType;
          this.constraints[i].msg = thisName + ' has type ' + (thisCol + 1);
          this.constraints[i].constraint = thisCol;
        break;
      }
      console.log('constraint',i,this.constraints[i]);
    }
    
    //console.log(constraintsArr);
    //this.constraints = constraintsArr;
    console.log(this.constraints);
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
          td.innerHTML = i+1;
          row.appendChild(td);
        }else{
          //Droppable Area
          td.style.border = '1px solid black';
          /*
          let ansDiv = document.createElement('div');
          ansDiv.className = 'content';
          ansDiv.style.width = '100%';
          ansDiv.style.height = '100%';
          ansDiv.style.backgroundColor = '#555';
          ansDiv.setAttribute('i',i);
          ansDiv.setAttribute('j',j);
          ansDiv.className = 'target';
          let dropEv = this.dropEv(i, j);
          let droppable = new DropZone(ansDiv, 'move', dropEv);
          td.appendChild(droppable.element);
          row.appendChild(td);
          */
          td.style.backgroundColor = '#555';
          td.setAttribute('i', i);
          td.setAttribute('j', j);
          td.className = 'target';
          let dropEv = this.dropEv(i, j);
          let droppable = new DropZone(td, 'move', dropEv)
          row.appendChild(droppable.element);
        }
      }
      table.appendChild(row);
    }
    el.appendChild(table);
    
    let shufAns = this.shuffle(this.answers);
    let ansTable = document.createElement('div');
    let ansRow = document.createElement('tr');
    for(let i = 0; i < this.answers.length; i++){
      let ansTd = document.createElement('td');
      ansTd.id = 'answerDiv' + i;
      ansTd.className = 'answer draggable';
      ansTd.innerHTML = shufAns[i];
      /*answerDiv.addEventListener('dragstart', () => {dragstart_handler(event);});
	    answerDiv.setAttribute('draggable',true);
      answerDiv.innerHTML = shufAns[i];
      answerDiv.style.border = '1px solid black';
      answerDiv.style.fontSize = '0.5rem';
      let ansTd = document.createElement('td');
      ansTd.appendChild(answerDiv);
      ansRow.appendChild(ansTd);*/
      let draggable = new Draggable(ansTd, 'move');
      ansRow.appendChild(draggable.element);
    }
    ansTable.appendChild(ansRow);
    el.appendChild(ansTable);
    
    /*let ul = document.createElement('ul');
    for(let i = 0; i < this.constraints.length; i++){
      let li = document.createElement('li');
      li.innerHTML = this.constraints[i].msg;
      li.style.fontSize = '0.5rem';
      li.setAttribute('draggable',false);
      ul.appendChild(li);
    }
    el.appendChild(ul);*/
    this.updateConstraintsList();
    
    //setDraggables();
  }
  
  /**
   * Triggered when an answer is dropped in a grid cell.
   */
  dropEv(row, col, ans)
  {
    console.log(row, col, ans);
    //SET GUESS ARRAY
    this.guess[row][col] = ans;
    this.checkGuesses();
  }
  
  checkGuesses()
  {
    let matchCount = 0;
    for(let i = 0; i < this.guess.length; i++){
      for(let j = 0; j < this.guess.length; j++){
        if(
          //This answer is correct for this row
          (this.guess[i][j] === this.answers[i]) && 
          //This column is correct for this row
          (this.grid[i].indexOf(1) == j) ){
          console.log('Match - ',this.guess[i][j],i,j);
          matchCount++;
        }
      }
    }
    if(matchCount == this.answers.length){
      this.win();
    }else{
      this.checkConstraints();
    }
  }
  
  checkConstraints()
  {
    for(let i = 0; i < this.constraints.length; i++){
      const c = this.constraints[i];
      //IS PLAYER SELECTED?
      if (this.guess.flat(2).indexOf(c.player) === false){
        //PLAYER NOT SELECTED AS AN ANSWER
        console.log(c.player + ' is not on the board');
        c.symbol = '?';
        return false;
      }else{
       /* switch(c.type){
          case 'col':
            //GET PLAYER COL
            if(this.guess[i][c.constraint - 1] == c.player){
              console.log(c.player + ' is in col ' + c.constraint);
              c.symbol = '✔️';
            }else{
              console.log(c.player + ' is NOT in col ' + c.constraint);
              c.symbol = '❌';
            }
          break;
          
          case 'row':
            //GET PLAYER COL
            if(this.guess[c.constraint - 1].indexOf(c.player) !== false){
              console.log(c.player + ' is in col ' + c.constraint);
              c.symbol = '✔️';
            }else{
              console.log(c.player + ' is NOT in col ' + c.constraint);
              c.symbol = '❌';
            }
          break;
          
          case 'above':
            //GET PLAYER ROW
            let guessRow = this.guess.filter( (row) => row.indexOf(c.player) );
            guessRow = this.guess.indexOf(guessRow);
            if(c.constraint === 'no-one'){
              if(guessRow === (this.gridSize - 1)){
                //IN LAST ROW
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
        } */
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