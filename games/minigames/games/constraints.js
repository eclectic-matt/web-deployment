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
    //INIT GRID
    this.grid = [];
    for(let i = 0; i < 100; i++){
      console.log(i,this.randomInt(0,i));
    }
    
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
    
    //GENERATE CONSTRAINTS
    this.constraints = new Array(this.gridSize).fill({});
    let constraintsArr = [];
    
    for(let i = 0; i < this.gridSize; i++){
      
      let constraintIndex = this.randomInt(0, this.constraints.length - 1);
      let constraint = this.constraintTypes.splice(constraintIndex, 1);
      this.constraints[i].type = constraint[0];
      console.log(constraint[0], this.answers[i], this.constraints[i]);
      let thisName = this.answers[i];
      let thisType = this.constraints[i].type;
      let thisCol = this.grid[i].indexOf(1);
      
      switch (thisType){
        case 'col':
          //DISPLAY MESSAGE (NOTE FRIENDLY 1-INDEX COLUMN)
          //this.constraints[i].msg = thisName + ' is in col ' + (thisCol+1);
          constraintsArr.push(thisName + ' is in col ' + (thisCol+1));
        break;
        case 'row':
          //this.constraints[i].msg = thisName + ' is in row ' + (i+1);
          constraintsArr.push(thisName + ' is in row ' + (i+1));
        break;
        case 'above':
          //ROW max - ABOVE NO-ONE
          if(i == (this.gridSize - 1)){
            //this.constraints[i].msg = thisName + ' is above no-one';
            constraintsArr.push(thisName + ' is above no-one');
          }else{
            //ELSE ABOVE EVERYONE IN ROWS i-(max)
            let otherName = this.answers[this.randomInt(i+1, this.answers.length - 1)];
            //this.constraints[i].msg = thisName + ' is above ' + otherName;
            constraintsArr.push(thisName + ' is above ' + otherName);
          }
        break;
        case 'below':
          //ROW 0 - BELOW NO-ONE
          if(i == 0){
            //this.constraints[i].msg = thisName + ' is below no-one';
            constraintsArr.push(thisName + ' is below no-one');
          }else{
            //BELOW EVERYONE IN ROWS 0-(i-1)
            let otherName = this.answers[this.randomInt(0,i - 1)];
            //this.constraints[i].msg = thisName + ' is below ' + otherName;
            constraintsArr.push(thisName + ' is below ' + otherName);
          }
        break;
        case 'left':
          //
          if(thisCol == (this.gridSize - 1)){
            constraintsArr.push(thisName + ' is left of no-one');
          }else{
            let otherName = this.answers.filter ( (el) => { return el !== thisName})[this.randomInt(0,this.answers.length - 2)];
            constraintsArr.push(thisName + ' is left of ' + otherName);
          }
        break;
        case 'right':
          if (thisCol == 0) {
            constraintsArr.push(thisName + ' is right of no-one');
          } else {
            let otherName = this.answers.filter((el) => { return el !== thisName })[this.randomInt(0, this.answers.length - 2)];
            constraintsArr.push(thisName + ' is right of ' + otherName);
          }
        break;
        default:
          //this.constraints[i].msg = thisName + ' has constraint ' + thisType;
          constraintsArr.push(thisName + ' has type ' + thisType);
        break;
      }
    }
    
    console.log(constraintsArr);
    this.constraints = constraintsArr;
    //ASSIGN IDENTIFIERS
    this.identifiers = [];
  }
  
  outputGrid(){
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
        }else{
          if(this.grid[i][j] === 1){
            td.innerHTML = this.answers[i];
          }
        }
        row.appendChild(td);
      }
      table.appendChild(row);
    }
    el.appendChild(table);
    
    let ul = document.createElement('ul');
    for(let i = 0; i < this.constraints.length; i++){
      let li = document.createElement('li');
      li.innerHTML = this.constraints[i];
      ul.appendChild(li);
    }
    el.appendChild(ul);
  }
  
  //
  // {{Char1}} does not live in {{Colour2}} 
  // {{Char2}} does not live in {{Colour3}} 
  // {{Char3}} does not live in {{Colour1}}
  
  
}
