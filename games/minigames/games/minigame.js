class MiniGame
{
  constructor(difficulty){
    //STORE GAME NAME
    this.gameName = this.constructor.name;
    console.log(this.gameName, difficulty);
    //STORE DIFFICULTY
    this.difficulty = difficulty;
    this.ended = false;
    this.startTime = new Date();
    let el = document.getElementById('main');
    let gameTitle = document.getElementById('gameTitle');
    if(!gameTitle){
      //CREATE AND SET TITLE
      gameTitle = document.createElement('h1');
      gameTitle.id = 'gameTitle';
      //Map to difficulty name
      let thisDiff = 'Trivial';
      for(const diff of diffDict){
        if(diff[1] == this.difficulty){
          thisDiff = diff[0];
        }
      }
      gameTitle.innerHTML = this.gameName + ' (' + thisDiff + ')';
      document.body.insertBefore(gameTitle, el);
    }else{
      //JUST SET TITLE
      gameTitle.innerHTML = this.gameName + ' (' + diffDict[this.difficulty] + ')';
    }
    
    
  }
  
  //Pass high score to save
  win(score)
  {
    this.ended = true;
    clearTimeout(this.timer);
    alert('Success!');
    this.showReplayButton();
    
    //Save game name
    let saveName = this.gameName + '-' + this.difficulty;
    //Load saved data from cookie
    let loadItem = loadLocalStorageItem(saveName);
    //Init save object
    let saveObj = {};
    saveObj.difficulty = this.difficulty;
    saveObj.gameName = this.gameName;
    saveObj.plays = 1;
    
    const thisTime = new Date().toLocaleString('en-uk');
    saveObj.lastPlayDate = thisTime;
    
    if(!loadItem || !loadItem.highScore){
      //New high score
      saveObj.highScore = score;
      saveObj.highScoreDate = thisTime;
    }else{
      let plays = (loadItem.plays) ? loadItem.plays : 1;
      saveObj.plays = plays + 1;
      //Overwrite if better
      if(loadItem.highScore < score){
        saveObj.highScore = score;
        saveObj.highScoreDate = thisTime;
      }else{
        saveObj.highScore = loadItem.highScore;
        saveObj.highScoreDate = loadItem.highScoreDate;
      }
    }
    saveLocalStorageItem(saveName, JSON.stringify(saveObj));
    
    //console.log(this.gameName, this.difficulty, score, saveObj, localStorage);
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
    replayBtn.className = 'fullBtn';
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
    prep();
    document.getElementById('gameTitle').innerHTML = '';
  }
  
  hideForm()
  {
    document.getElementById('form').style.display = 'none';
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
	
	currency(amount, symbol = '£')
	{
	  const options = {
      style: 'decimal',  // Other options: 'currency', 'percent', etc.
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
	  return symbol + amount.toLocaleString('en-us',options);
	  //return symbol + parseFloat(amount).toFixed(2);
	}
	
}
