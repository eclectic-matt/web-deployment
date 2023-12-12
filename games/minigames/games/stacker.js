class Stacker extends MiniGame
{
  constructor(difficulty)
  {
    super(difficulty);
    this.init();
  }
  
  init()
  {
    this.stackHeight = 0;
    this.boxWidth = 50;
    this.speed = (this.difficulty + this.stackHeight) * 0.5;
    console.log(this.speed);
    this.dropping = false;
    this.movingleft = false;
    this.dropBoxes = []; //The stack
    this.x = 50;
    this.y = 10;
    this.outputPanel();
  }
  
  outputPanel()
  {
    document.getElementById('form').style.display = 'none';
    let el = document.getElementById('main');
    //CLEAR main
    el.innerHTML = '';

    //DESCRIPTION
    let head = document.createElement('h2');
    head.innerHTML = 'Drop the boxes to form a stack - don\' let it topple!';
    el.appendChild(head);
    
    let cnv = document.createElement('canvas');
    cnv.id = 'cnv';
    let width = window.innerWidth - (window.innerWidth * 0.05);
    let height = window.innerHeight - (window.innerHeight * 0.4);
    this.dropHeight = height - this.boxWidth;
    cnv.width = width;
    cnv.height = height;
    el.appendChild(cnv);
    
    this.drawCanvas();
    
    let clickBtn = document.createElement('button');
    clickBtn.id = 'clickBtn';
    clickBtn.innerHTML = 'Drop!';
    clickBtn.style.width = '100%';
    clickBtn.style.fontSize = '2rem';
    clickBtn.style.height = '3rem';
    clickBtn.style.backgroundColor = '#c22';
    clickBtn.style.color = '#fff';
    clickBtn.onclick = () => {
      this.fireBtn();
    };
    
    el.appendChild(document.createElement('br'));
    
    el.appendChild(clickBtn);
    
    this.timer = requestAnimationFrame( this.moveTarget.bind(this) );
  }
  
  drawCanvas()
  {
    let cnv = document.getElementById('cnv');
    let width = cnv.width;
    let height = cnv.height;
    let ctx = cnv.getContext('2d');
    let bgCol = '#777';
    let boxCol = '#d4a';
    
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = boxCol;
    ctx.fillRect((width / this.x), (height / this.y), this.boxWidth, this.boxWidth);
    //console.log('draw x y',(width / this.x), (height / this.y), this.boxWidth);
  }
  
  fireBtn()
  {
    if (this.ended) return;
    if (this.dropping) return;
    
    this.dropBox();
  }
  
  dropBox()
  {
    this.dropping = true;
  }
  
  moveTarget(timestamp)
  {
    if(!this.previous){
      this.previous = timestamp;
    }
    let ms = timestamp - this.previous;
    //console.log(ms,timestamp, this.previous);
    this.previous = timestamp;
    
    if(this.dropping){
      this.y += this.speed * (ms / 60);
      if(this.y <= this.dropHeight){
        this.dropBoxes.push( { x: this.x, y: this.y});
        this.dropping = false;
      }
    }else{
      if(this.movingLeft){
        this.x += this.speed * (ms / 60);
        if(this.x >= 100){
          //MOVE BACK BY AMOUNT MOVED PAST
          this.x = 100 - (this.x - 100);
          this.movingLeft = false;
        }
      }else{
        this.x -= this.speed * (ms / 60);
        if(this.x <= 0){
          //MOVE BACK BY AMOUNT MOVED PAST
          this.x = -this.x;
          this.movingLeft = true;
        }
      }
      //console.log('moved', this.x, this.y, this.movingLeft, this.dropping);
    
    }
    console.log(this.x.toFixed(2), this.y.toFixed(2));
    
    this.drawCanvas();
    
    this.timer = requestAnimationFrame( this.moveTarget.bind(this) );
  }
  
  lose()
  {
    let result = document.createElement('h1');
    result.innerHTML = 'Target: ' + this.targetLeft.toFixed(2) + ' - ' + (this.targetLeft + this.targetWidth).toFixed(2) + '<br>Clicked: ' + this.x.toFixed(2) + '!';
     document.getElementById('main').appendChild(result);
    super.lose();
    //cancelAnimationFrame(this.moveTarget);
    cancelAnimationFrame(this.timer);
  }
  
  win()
  {
    let result = document.createElement('h1');
    result.innerHTML = 'Target: ' + this.targetLeft.toFixed(2) + ' - ' + (this.targetLeft + this.targetWidth).toFixed(2) + '<br>Clicked: ' + this.x.toFixed(2) + '!';
     document.getElementById('main').appendChild(result);
    let endTime = new Date();
    let totalTime = 1 / ((endTime - this.startTime) * 1000);
    super.win(totalTime);
    //cancelAnimationFrame(this.moveTarget);
    //cancelAnimationFrame(this.moveTarget.bind(this))
    cancelAnimationFrame(this.timer);
  }
}