class Codeword extends MiniGame
{
  
  constructor(difficulty)
  {
    super(difficulty);
    this.width = difficulty + 1;
    this.height = difficulty + 2;
        
    this.selectedColor = '#0dd';
    this.matchedColor = '#0f0';
    this.defaultColor = '#fff';
    
    this.timer = setTimeout(this.tickTimer.bind(this), 250);
    this.init();
  }
  
  init()
  {
    this.generateCodeword();
    this.outputPanel();
  }
  
  generateCodeword()
  {
    this.codeword = "";
    this.codelength = this.difficulty + 1;
    
    switch (this.difficulty){
      case 1:
        this.chars = ['A','B','C'];
        this.description = 'the letters "A,B,C"';
      break;
      case 2:
        this.chars = ['A','B','C','D'];
        this.description = 'the letters "A,B,C,D"';
      break;
      case 3:
        this.chars = ['A','E','I','O','U'];
        this.description = 'the vowels "A,E,I,O,U"';
      break;
      case 4:
        this.chars = ['A','B','C','D','E','F'];
      this.description = 'the letters "A - F"';
      break;
      case 5:
        this.chars = ['A','B','C','D','E','F','G'];
        this.description = 'the letters "A - G"';
      break;
      case 6:
        this.chars = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
        this.description = 'the letters "A - M"';
      break;
      case 7:
        this.chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        this.description = 'the alphabet "A - Z"';
      break;
    }
    
    /*
    //BIT TOO HARD
    switch (this.difficulty) {
      case 1:
        this.chars = ['A', 'B', 'C', 'D'];
        this.description = 'the letters, "A,B,C,D"';
        break;
      case 2:
        this.chars = ['A', 'E', 'I', 'O', 'U'];
        this.description = 'the vowels, "A,E,I,O,U"';
        break;
      case 3:
        this.chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        this.description = 'the letters "A - G"';
        break;
      case 4:
        this.chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
        this.description = 'the letters "A - M"';
        break;
      case 5:
        this.chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        this.description = 'the alphabet "A - Z"';
        break;
    }
    */
    
    for(let i = 0; i < this.codelength; i++){
      let thisCharCode = Math.floor(Math.random() * this.chars.length);
      this.codeword += this.chars[thisCharCode];
    }
    this.currentGuess = null;
  }
  
  outputPanel()
  {
    document.getElementById('form').style.display = 'none';
    let el = document.getElementById('main');
    //CLEAR main
    el.innerHTML = '';

    //DESCRIPTION
    let head = document.createElement('h2');
    head.innerHTML = 'Guess the codeword of length ' + this.codelength + ' from ' + this.description;
    el.appendChild(head);
    
    //OUTPUT TIMER
    this.createTimer(el);
        
    //CODEWORD TABLE
    let table = document.createElement('table');
    //HEADER ROW
    let tr = document.createElement('tr');
    for (let i = 0; i < this.codelength; i++){
      let th = document.createElement('th');
      th.innerHTML = (i + 1);
      tr.appendChild(th);
    }
    table.appendChild(tr);
    
    //INCREMENT UP BUTTON ROW
    tr = document.createElement('tr');
    for (let i = 0; i < this.codelength; i++){
      let td = document.createElement('td');
      let btn = document.createElement('button');
      btn.innerHTML = '🔺';
      btn.setAttribute('i', i);
      btn.style.width = '100%';
      btn.style.fontSize = '1.25rem';
      btn.onclick = function() {
        let index = this.getAttribute('i');
        td.style.fontSize = '2rem';
        console.log('increment',index);
        game.incrementLetter(index);
      }
      td.appendChild(btn);
      tr.appendChild(td);
    }
    table.appendChild(tr);
    
    //CODE.WORD ROW
    tr = document.createElement('tr');
    for (let i = 0; i < this.codelength; i++){
      let td = document.createElement('td');
      //td.innerHTML = this.codeword[i];
      td.innerHTML = '-';
      td.id = 'codeLetter' + i;
      tr.appendChild(td);
    }
    table.appendChild(tr);
    
    //INCREMENT DOWN BUTTON ROW
    tr = document.createElement('tr');
    for (let i = 0; i < this.codelength; i++){
      let td = document.createElement('td');
      let btn = document.createElement('button');
      btn.innerHTML = '🔻';
      btn.style.width = '100%';
      btn.style.fontSize = '1.25rem';
      btn.setAttribute('i',i);
      btn.onclick = function() {
        let index = this.getAttribute('i');
        console.log('decrement',index);
        game.decrementLetter(index);
      }
      td.appendChild(btn);
      tr.appendChild(td);
    }
    table.appendChild(tr);
    
    el.appendChild(table);
    
    let submitBtn = document.createElement('button');
    submitBtn.accessKey = "g";
    submitBtn.innerHTML = 'Submit Guess (Alt + G)';
    submitBtn.onclick = function(submitBtn){
      this.checkGuess();
    }.bind(this);
    el.appendChild(submitBtn);
    el.appendChild(document.createElement('br'));
    
    let resultsHead = document.createElement('h2');
    resultsHead.id = 'resultsHead';
    resultsHead.innerHTML = 'Results:';
    el.appendChild(resultsHead);
    
    let resultsTable = document.createElement('table');
    resultsTable.id = 'resultsTable';
    el.appendChild(resultsTable);
    
    //console.log(this.codeword);
    
   // this.showReplayButton();
  }
  
  checkGuess()
  {
    if(this.ended) return;
    
    let guess = [];
    for(let i = 0; i < this.codelength; i++){
      let guessEl = document.getElementById('codeLetter' + i);
      guess.push(guessEl.innerHTML);
    }
    console.log('guess', guess);
    let result = [];
    let correctLetters = this.codeword.split('');
    console.log('correct',correctLetters);
    let win = true;
    let tr = document.createElement('tr');
    for(let i = 0; i < this.codelength; i++){
      console.log(i,guess[i],correctLetters[i]);
      let td = document.createElement('td');
      td.innerHTML = guess[i];
      if(correctLetters[i] === guess[i]){
        result.push('Correct');
        td.style.backgroundColor = "#0f0";
      }else if (correctLetters.includes(guess[i]) !== false){
        result.push('Position');
        win = false;
        td.style.backgroundColor = "#0dd";
      }else{
        result.push('Incorrect');
        win = false;
        td.style.backgroundColor = "#d00";
      }
      tr.appendChild(td);
    }
    //document.getElementById('resultsTable').appendChild(tr);
    document.getElementById('resultsTable').insertBefore(tr,document.getElementById('resultsTable').firstChild);
    if(win){
      document.getElementById('resultsHead').innerHTML = 'The code was ' + this.codeword;
      this.win();
    }
    console.log('result',result);
  }

  lose(){
    document.getElementById('resultsHead').innerHTML = 'The code was ' + this.codeword;
    super.lose();
  }
  
  incrementLetter(i)
  {
    let thisTd = document.getElementById('codeLetter' + i);
    let thisIndex = this.chars.indexOf(thisTd.innerHTML);
    //console.log(this.chars, i, thisIndex);
    thisIndex = (thisIndex + 1 > this.chars.length - 1 ? 0 : thisIndex + 1);
    let thisLetter = this.chars[thisIndex];
    thisTd.innerHTML = thisLetter;
  }
  
  decrementLetter(i)
  {
    let thisTd = document.getElementById('codeLetter' + i);
    let thisIndex = this.chars.indexOf(thisTd.innerHTML);
    thisIndex = (thisIndex - 1 < 0) ? this.chars.length - 1: thisIndex - 1;
    //console.log(this.chars, i, thisIndex);
    let thisLetter = this.chars[thisIndex];
    thisTd.innerHTML = thisLetter;
  }

}
