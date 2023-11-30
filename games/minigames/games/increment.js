class Increment extends MiniGame
{
  
  constructor(difficulty)
  {
    super(difficulty);
    this.width = difficulty+1;
    this.height = difficulty+1;
    this.increment = Number(Math.floor(Math.random() * (5 * this.difficulty)) + this.difficulty);
    console.log('generate','difficulty',this.difficulty,'increment',this.increment);
    this.timer = setTimeout(this.tickTimer.bind(this), 250);
    this.init();
  }
  
  init()
  {
    let main = document.getElementById("main");
    //GENERATE GRID
    this.generateGrid();
    //OUTPUT GRID
    this.outputGrid(main);
  }
  
  generateGrid()
  {
    this.grid = [];
    this.values = [];
    
    for(let i = 1; i <= (this.width * this.height); i++){
      this.values.push(i * this.increment);
    }
    
    this.values = this.shuffle(this.values);
    this.current = this.increment;
    let index = 0;
    
    for(let i = 0; i < this.width; i++)
    {
      this.grid[i] = [];
      
      for(let j = 0; j < this.height; j++)
      {
        this.grid[i][j] = this.values[index];
        this.current += this.increment;
        index++;
      }
    }
    
    this.maxValue = Math.max(...this.values);
    //RESET CURRENT
    this.current = this.increment;
  }
  
  outputGrid()
  {
    let form = document.getElementById('form');
    form.style.display = 'none';
    let el = document.getElementById('main');
    //CLEAR main
    el.innerHTML = '';
    let head = document.createElement('h2');
    head.style.width = '100%';
    head.style.fontSize = '0.95rem';
    head.innerHTML = 'Click the ' + this.increment + ' times table!';
    el.appendChild(head);
    
    this.createTimer(el);
    
    let table = document.createElement('table');
    for(let i = 0; i < this.width; i++){
      let row = document.createElement('tr');
      for(let j = 0; j < this.height; j++){
        let td = document.createElement('td');
        let div = document.createElement('div');
        div.className = "content";
        let btn = document.createElement('button');
        btn.innerHTML = this.grid[i][j];
        div.appendChild(btn);
        td.appendChild(div);
        btn.onclick = function(btn){
          //console.log('onclick',btn);
          game.checkClick(btn)
        }
        btn.setAttribute('i',i);
        btn.setAttribute('j',j);
        row.appendChild(td);
      }
      table.appendChild(row);
    }
    el.appendChild(table);
  }
  
  checkClick(ev)
  {
    if(this.ended) return false;
    let row = ev.target.getAttribute('i');
    let col = ev.target.getAttribute('j');
    console.log('checkClick', row, col, this.current);
    if(this.grid[row][col] == this.current){
      if(this.current === this.maxValue){
        this.win();
      }else{
        console.log('Correct!',this.current, this.maxValue);
        this.current += Number(this.increment);
      }
      ev.target.disabled = true;
      ev.target.style.backgroundColor = "#0f0";
      ev.target.style.color = "#fff";
    }else{
      console.log('Incorrect!');
      for(let i = 0; i < this.difficulty; i++){
        this.tickTimer.bind(this);
      }
    }
  }
}
