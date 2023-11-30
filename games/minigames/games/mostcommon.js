class MostCommon extends MiniGame
{
  constructor(difficulty)
  {
    super(difficulty);
    this.timer = setTimeout(this.tickTimer.bind(this), 250);
    this.init();
    this.outputSymbols();
  }
  
  init()
  {
    this.symbols = ['😬','🥰','😎','😔','😘','😀','🤣'];
    
    this.total = this.difficulty * this.difficulty * 10 + Math.floor(Math.random() * 10);
    //console.log('total',this.total);
    
    this.correct = this.symbols[Math.floor(Math.random()*this.symbols.length)];
    //console.log('Correct',this.correct);
    
    //CORRECT AMOUNT ALWAYS 1/2 - 1
    //this.correctAmount = (this.total / 2) - 1;
    this.remainingSymbols = parseInt(this.difficulty) + 1;
    //console.log('RemainSymbols',this.remainingSymbols);
    
    //console.log('avg',this.total / Number(this.remainingSymbols + 1));
    
    this.correctAmount = Math.floor(this.total / this.remainingSymbols) + 1;
    //console.log('CorrectAmount',this.correctAmount);
    
    this.total -= this.correctAmount;
    this.values = [];
    this.symbolsUsed = [this.correct];
    
    for (let i = 0; i < this.correctAmount; i++){
      this.values.push(this.correct);
    }
    
    let thisTrickAmount = this.correctAmount - 1;
    let availSymbols = this.symbols.filter(x => !this.symbolsUsed.includes(x));
      //console.log('availSymbols', availSymbols);
    let thisSymbol = availSymbols[Math.floor(Math.random()*availSymbols.length)];
      
    //console.log('adding',thisSymbol,thisTrickAmount,'times');
      
    this.symbolsUsed.push(thisSymbol);
      
    for (let j = 0; j < thisTrickAmount; j++){
      this.values.push(thisSymbol);
    }
    
    for(let i = 0; i < this.remainingSymbols - 1; i++){
      
      //GENERATE A RANDOM AMOUNT FOR THE CURRENT SYMBOL
      let symbolAmount = Math.floor(this.total / this.remainingSymbols) - 1;
      
      //IF RUN OUT OF SPACE, EXIT EARLY
      if(symbolAmount == 0) break;
      
      //this.total -= symbolAmount;
      //let availSymbols = this.symbols.diff(this.symbolsUsed);
      
      let availSymbols = this.symbols.filter(x => !this.symbolsUsed.includes(x));
      //console.log('availSymbols', availSymbols);
      
      let thisSymbol = availSymbols[Math.floor(Math.random()*availSymbols.length)];
      
      //console.log('adding',thisSymbol,symbolAmount,'times');
      
      this.symbolsUsed.push(thisSymbol);
      
      for (let j = 0; j < symbolAmount; j++){
        this.values.push(thisSymbol);
      }
    }
    
    //SHUFFLE THE RESULTING ARRAYS
    this.values = this.shuffle(this.values);
    this.symbolsUsed = this.shuffle(this.symbolsUsed);
    //console.log(this.values);
    
  }
  
  outputSymbols()
  {
    //HIDE FORM
    document.getElementById('form').style.display = 'none';
    
    let el = document.getElementById('main');
    
    let outHead = document.createElement('h2');
    outHead.innerHTML = 'Click the most common symbol from the list below:';
    el.appendChild(outHead);
    
    let table = document.createElement('table');
    let tr = document.createElement('tr');
    for(let i=0; i< this.symbolsUsed.length; i++){
      let td = document.createElement('td');
      let btn = document.createElement('button');
      btn.innerHTML = this.symbolsUsed[i];
      btn.style.fontSize = '2rem';
      btn.setAttribute('symbol',this.symbolsUsed[i]);
      btn.onclick = function(ev){
        let btnSymbol = ev.target.getAttribute('symbol');
        let answerHead = document.createElement('h2');
        el.appendChild(answerHead);
        if(btnSymbol === game.correct){
          this.win();
          answerHead.innerHTML = 'Correct - ';
        }else{
          this.lose();
          let incorrectAmount = this.values.filter( (el) => { return (el == btnSymbol)}).length;
          answerHead.innerHTML = 'Wrong - you clicked ' + btnSymbol + ' (x' + incorrectAmount + ') but ' ;
        }
        answerHead.innerHTML += 'the correct symbol was ' + game.correct + ' (x' + this.correctAmount + ')!';
      }.bind(this);
      td.appendChild(btn);
      tr.appendChild(td);
    }
    table.appendChild(tr);
    el.appendChild(table);
    el.appendChild(document.createElement('br'));
    let outDiv = document.createElement('div');
    outDiv.style.textAlign = 'center';
    outDiv.style.alignContent = 'center';
    for (let i=0; i < this.values.length; i++){
      let span = document.createElement('span');
      span.innerHTML = this.values[i];
      outDiv.appendChild(span);
    }
    el.appendChild(outDiv);
    el.appendChild(document.createElement('br'));
    //OUTPUT TIMER
    this.createTimer(el);
  }
  
  win(){
    let el = document.getElementById('main');
    super.win();
  }
  
  lose(){
    let answerHead = document.createElement('h2');
    answerHead.innerHTML = 'The correct symbol was ' + this.correct + ' (x' + this.correctAmount + ')!';
    document.getElementById('main').appendChild(answerHead);
    
    super.lose();
  }
}
