class MiniGame
{
  constructor(difficulty){
    this.difficulty = difficulty;
    this.ended = false;
  }
  
  win()
  {
    this.ended = true;
    clearTimeout(this.timer);
    alert('Success!');
    this.showReplayButton();
  }
  
  lose()
  {
    clearTimeout(this.timer);
    this.ended = true;
    alert('Failed!');
    this.showReplayButton();
  }
  
  createTimer(el)
  {
    let timerWrapDiv = document.createElement('div');
    let timerDiv = document.createElement('div');
    timerDiv.id = "timer";
    timerDiv.style.width = '100%';
    timerDiv.style.height = '50px';
    timerDiv.style.backgroundColor = "#f00";
    timerWrapDiv.appendChild(timerDiv);
    el.appendChild(timerWrapDiv);
  }
  
  tickTimer()
  {
    let timerEl = document.getElementById('timer');
    let percent = parseInt(timerEl.style.width.replace('%','')) - 1;
    //console.log(percent);
    timerEl.style.width = percent + '%';
    
    if(percent <= 0){
      this.lose();
    }else{
      this.timer = setTimeout(this.tickTimer.bind(this), 250);
    }
  }
  
  
  showReplayButton(){
    let replayBtn = document.createElement('button');
    let self = this;
    replayBtn.onclick = function(self) {
      game.showForm();
    }
    replayBtn.innerHTML = 'Play again?';
    document.getElementById('main').appendChild(replayBtn);
  }
  
  showForm(){
    document.getElementById('main').innerHTML = '';
    document.getElementById('form').style.display = 'block';
  }
  
  //#-#-#-#-#-#-#-#-#
  // UTILITY METHODS
  //#-#-#-#-#-#-#-#-#
  
  shuffle(arr)
  {
		var j, x, i;
		for (i = arr.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = arr[i];
			arr[i] = arr[j];
			arr[j] = x;
		}
		return arr;
	}
	
	mode(arr){
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
  }

	randomInt(min, max){
	  return Math.floor(Math.random() * (max-min)) + min;
	}
	
	randomAlpha(){
    return String.fromCharCode(65+Math.floor(26*Math.random()));
	}
	
	randomColor(){
	  let col = '#';
	  for (let i = 0; i < 6; i++){
	    let colIndex = Math.floor(Math.random()*16);
	    if(colIndex >= 10){
	      col += String.fromCharCode(65+(colIndex - 10));
	    }else{
	      col += colIndex;
	    }
	    //col += '' + col;
	  }
	  //console.log(col);
	  return col;
	}
	
}
