
class Pairs extends MiniGame
{
  constructor(difficulty)
  {
    super(difficulty);
    if(window.innerWidth >= window.innerHeight){
      
      this.width = Math.max(difficulty, 2);
      this.height = Math.max(difficulty * 2, 2);
      //console.log('landscape', this.width, this.height);
    }else{
      this.width = Math.max(difficulty * 2, 2);
      this.height = Math.max(difficulty, 2);
      //console.log('portrait', this.width, this.height);
    }
        
    this.selectedColor = '#0dd';
    this.matchedColor = '#0f0';
    this.defaultColor = '#000';
    
    this.timer = setTimeout(this.tickTimer.bind(this), 250);
    this.init();
  }
  
  init()
  {
    this.selected = null;
    //GENERATE GRID
    this.generateGrid();
    //OUTPUT GRID
    this.outputGrid();
  }
  
  generateGrid()
  {
    this.grid = [];
    this.values = [];
    this.symbols = ['♠️', '♦️', '♣️', '♥️', '⭕', '➕', '🔲', '🔼','✅','❌','💩','⤵️','🔁','😎','🥰','⚠️','⭐','💦','👀','🌈','🌍','☢️','🔥'];
    
    this.pairsCount = Math.floor(this.width * this.height / 2);
    
    for(let i = 1; i <= this.pairsCount; i++){
      let randomIndex = Math.floor(Math.random() * this.symbols.length);
      let randomSymbol = this.symbols.splice(randomIndex, 1);
      this.values.push(randomSymbol, randomSymbol);
    }
    
    this.values = this.shuffle(this.values);
    let index = 0;
    
    for(let i = 0; i < this.width; i++)
    {
      this.grid[i] = [];
      
      for(let j = 0; j < this.height; j++)
      {
        this.grid[i][j] = this.values[index];
        index++;
      }
    }
    
    this.maxValue = Math.max(...this.values);
    //RESET CURRENT
    this.current = 0;
  }
  
  outputGrid()
  {
    document.getElementById('form').style.display = 'none';
    let el = document.getElementById('main');
    //CLEAR main
    el.innerHTML = '';
    let head = document.createElement('h2');
    head.style.width = '100%';
    head.style.fontSize = '0.9rem';
    head.innerHTML = 'Find the pairs!';
    el.appendChild(head);
    
    this.createTimer(el);
    let fontScale = 8;
    let fontSize = parseFloat( fontScale / (this.difficulty+1)).toFixed(2) + 'rem';
    console.log('size', fontSize);
    
    let table = document.createElement('table');
    for(let i = 0; i < this.width; i++){
      let row = document.createElement('tr');
      for(let j = 0; j < this.height; j++){
        let td = document.createElement('td');
        td.className = 'pairsTd';
        let div = document.createElement('div');
        div.className = "content";
        let btn = document.createElement('button');
        btn.className = 'pairsBtn';
        btn.style.fontSize = fontSize;
        btn.onclick = function(btn){
          //console.log('onclick',btn);
          game.checkClick(btn)
        }
        btn.setAttribute('symbol',this.grid[i][j]);
        let span = document.createElement('span');
        span.style.display = 'none';
        span.style.fontSize = fontSize;
        span.innerHTML = this.grid[i][j];
        btn.appendChild(span);
        //btn.innerHTML = this.grid[i][j];
        div.appendChild(btn);
        td.appendChild(div);
        
        row.appendChild(td);
      }
      table.appendChild(row);
    }
    el.appendChild(table);
  }
  
  checkClick(ev)
  {
    //ALREADY LOST?
    if(this.ended) return false;

    let thisSymbol = ev.target.getAttribute('symbol');
    
    //IF NO PREVIOUS SELECTED ELEMENT
    if(this.selected === null){
      //SELECT THIS SYMBOL
      this.selectEl(ev.target, this);
      return true;
    }
    
    //CLICKED SELF?
    if(ev.target === this.selected.target){
      //console.log('clicked self', thisSymbol);
      //ev.target.innerHTML = '';
      this.deselectEl(ev.target, this);
      return false;
    }
    
    //ELSE, CHECK SYMBOL MATCH
    if(thisSymbol === this.selected.symbol){
      //MATCH
      //console.log('match', thisSymbol);
      
      //DISABLE PREVIOUS SELECTION
      this.matchEl(this.selected.target, this);
      
      //DISABLE CURRENT SELECTION
      this.matchEl(ev.target, this);
      
      //CLEAR STORED SELECTION
      this.selected = null;
      this.current++;
      if(this.current === this.pairsCount){
        let endTime = new Date();
        let totalTime = 1 / ((endTime - this.startTime) * 1000);
        this.win(totalTime);
      }
    }else{
      //NO MATCH
      //console.log('no match', thisSymbol);
      //CLEAR PREVIOUS
      this.deselectEl(this.selected.target, this);
      //SET CURRENT AS SELECTED AND VISIBLE 
      this.selectEl(ev.target, this);
    }
  }
  
  selectEl(el, self){
    let thisSymbol = el.getAttribute('symbol');
    //SELECT THIS SYMBOL
    //console.log('init select', thisSymbol);
    this.selected = {symbol: thisSymbol, target: el};
    el.children[0].style.display = 'block';
    el.children[0].style.padding = 0;
    el.children[0].style.margin = 0;
    el.children[0].style.width = '100%';
    el.children[0].style.height = '100%';
    el.style.backgroundColor = this.selectedColor;
  }
  
  deselectEl(el, self){
    el.children[0].style.display = 'none';
    el.style.backgroundColor = this.defaultColor;
    this.selected = null;
  }
  
  matchEl(el){
    el.disabled = true;
    el.style.backgroundColor = this.matchedColor;
    el.style.color = '#fff';
    el.children[0].style.display = 'block';
    el.children[0].style.padding = 0;
    el.children[0].style.margin = 0;
    el.children[0].style.width = '100%';
    el.children[0].style.height = '100%';
  }
  
}
