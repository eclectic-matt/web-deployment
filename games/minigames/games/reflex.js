class Reflex extends MiniGame
{
  constructor(difficulty)
  {
    super(difficulty);
    //this.timer = setTimeout(this.tickTimer.bind(this), 250);
    //THIS IS A PERCENTAGE (MAX 20) OF THE TOTAL WIDTH 
    this.targetWidth = 16 / difficulty;
    this.speed = difficulty * 1.5;
    this.movingLeft = true;
    //x IS A PERCENTAGE OF THE WIDTH WHERE THE "CROSSHAIR" IS
    this.x = 0;
    this.init();
  }
  
  init()
  {
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
    head.innerHTML = 'Click when the bar below is within the target';
    el.appendChild(head);
        
    //CREATE DIV''
    let wrapDiv = document.createElement('div');
    wrapDiv.style.width = '95%';
    wrapDiv.style.border = '1px solid white';
    wrapDiv.style.position = 'absolute';
    wrapDiv.style.height = '50px';
    wrapDiv.style.margin = 0;
    wrapDiv.style.padding = 0;
    
    let targetLine = document.createElement('div');
    targetLine.id = 'targetLine';
    targetLine.style.width = '1px';
    targetLine.style.height = '50px';
    targetLine.style.backgroundColor = '#fff';
    targetLine.style.position = 'absolute';
    //targetLine.style.top = '1px';
    targetLine.style.left = '0%';
    targetLine.style.zIndex = 5;
    
    wrapDiv.appendChild(targetLine);
    
    let targetBox = document.createElement('div');
    targetBox.id = 'targetBox';
    targetBox.style.width = this.targetWidth + "%";
    targetBox.style.height = "50px";
    targetBox.style.position = 'absolute';
    this.targetLeft = this.randomInt(0, 100 - this.targetWidth);
    targetBox.style.left = this.targetLeft + '%';
    //targetBox.style.top = '1px';
    targetBox.style.backgroundColor = '#c22';
    targetBox.style.zIndex = 3;
    
    wrapDiv.appendChild(targetBox);
    
    el.appendChild(wrapDiv);
    
    let clickBtn = document.createElement('button');
    clickBtn.id = 'clickBtn';
    clickBtn.innerHTML = 'Fire!';
    clickBtn.style.width = '100%';
    clickBtn.style.fontSize = '2rem';
    clickBtn.style.height = '3rem';
    clickBtn.style.backgroundColor = '#c22';
    clickBtn.style.color = '#fff';
    clickBtn.onclick = function(){
      if(this.ended) return;
      //clearTimeout(this.moveTimer);
      window.cancelAnimationFrame(this.moveTarget.bind(this));
      if( (this.x >= this.targetLeft) && (this.x <= (this.targetLeft + this.targetWidth)) ){
        this.win();
      }else{
        this.lose();
      }
    }.bind(this);
    
    el.appendChild(document.createElement('br'));
    el.appendChild(document.createElement('br'));
    el.appendChild(document.createElement('br'));
    
    el.appendChild(clickBtn);
    
    //this.moveTimer = setTimeout(this.moveTarget.bind(this), 25);
    window.requestAnimationFrame(this.moveTarget.bind(this));
  }
  
  moveTarget(timestamp)
  {
    if(!this.previous){
      this.previous = timestamp;
    }
    let ms = timestamp - this.previous;
    //console.log(ms,timestamp, this.previous);
    this.previous = timestamp;
    
    //console.log('moving ' + (this.movingLeft ? 'left' : 'right'));
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
    document.getElementById('targetLine').style.left = this.x + '%';
    //RESET TIMEOUT
    //this.moveTimer = setTimeout(this.moveTarget.bind(this), 25);
    
    window.requestAnimationFrame(this.moveTarget.bind(this));
  }
  
  lose()
  {
    window.cancelAnimationFrame(this.moveTarget);
    let result = document.createElement('h1');
    result.innerHTML = 'Target: ' + this.targetLeft.toFixed(2) + ' - ' + (this.targetLeft + this.targetWidth).toFixed(2) + '<br>Clicked: ' + this.x.toFixed(2) + '!';
     document.getElementById('main').appendChild(result);
    super.lose();
  }
  
  win()
  {
    window.cancelAnimationFrame(this.moveTarget);
    let result = document.createElement('h1');
    result.innerHTML = 'Target: ' + this.targetLeft.toFixed(2) + ' - ' + (this.targetLeft + this.targetWidth).toFixed(2) + '<br>Clicked: ' + this.x.toFixed(2) + '!';
     document.getElementById('main').appendChild(result);
    let endTime = new Date();
    let totalTime = 1 / ((endTime - this.startTime) * 1000);
    super.win(totalTime);
  }
}