class Targets extends MiniGame {
	
	constructor(difficulty)
	{
		super(difficulty);
		//this.timer = setTimeout(this.tickTimer.bind(this), 250);
		//THIS IS A PERCENTAGE (MAX 20) OF THE TOTAL WIDTH 
		this.targetCount = difficulty * 8;
		this.clickedCount = 0;
		//this.speed = difficulty * 2;
		this.speed = 0.1;
		this.startTime = new Date();
		this.timer = setTimeout(this.tickTimer.bind(this), 250);
		this.init();
	}
		
	init()
	{
		this.generateTargets();
		this.outputPanel();
	}
	
	generateTargets()
	{
		this.targets = [];
		for(let i = 0; i < this.targetCount; i++){
			
			let target = document.createElement('div');
			target.id = 'target' + i;
			target.style.width = (200/this.difficulty) + 'px';
			target.style.height = (200/this.difficulty) + 'px';
			//target.style.height = 'auto';
			target.style.position = 'absolute';
			target.style.top = this.randomInt(0,99) + '%';
			target.style.left = this.randomInt(0,99) + '%';
			target.style.borderRadius = '50%';
			target.style.textAlign = 'center';
			target.style.verticalAlign = 'center';
			//target.setAttribute('xDir',(Math.random()>0.5?Math.random():-1*Math.random()));
			//target.setAttribute('yDir',(Math.random()>0.5?Math.random():-1*Math.random()));
			target.setAttribute('xDir',(Math.random()>0.5?0.1:-0.1));
			target.setAttribute('yDir',(Math.random()>0.5?0.1:-0.1));
			//let randCol = this.randomInt(0,999);
			let randCol = this.randomColor();
			target.style.backgroundColor = randCol;
			//randCol = 999 - randCol;
			target.style.color = '#fff';
			target.innerHTML = ' X ';
			target.padding = '3%';
			target.onclick = function(ev){
				console.log(ev.target.id,'clicked');
				if (this.ended) return;
				ev.target.innerHTML = '';
				ev.target.style.display = 'none';
				this.clickedCount++;
				document.getElementById('remainSpan').innerHTML = (this.targetCount - this.clickedCount);
				if(this.clickedCount == this.targetCount){
					this.win();
				}
			}.bind(this);
			
			this.targets.push(target);
		}
		console.log(this.targets);
	}
	
	outputPanel()
	{
		document.getElementById('form').style.display = 'none';
		let el = document.getElementById('main');
		//CLEAR main
		el.innerHTML = '';

		//DESCRIPTION
		let head = document.createElement('h2');
		head.innerHTML = 'Click all the targets - <span id="remainSpan">' + (this.targetCount - this.clickedCount) + '</span> left';
		el.appendChild(head);
		
		//OUTPUT TIMER
		this.createTimer(el);
		
		//OUTPUT TARGETS
		for(let i = 0; i < this.targets.length; i++){
			el.appendChild(this.targets[i]);
		}
		
		this.moveTimer = setTimeout(this.moveTarget.bind(this),25);
	}
	
	moveTarget()
	{
		//console.log('move',this.targets.length,'targets');
		let el = document.getElementById('main');
		//MOVE ALL TARGETS
		for(let i = 0; i < this.targets.length; i++){
			//
			let targetObj = this.targets[i];
			let target = document.getElementById(targetObj.id);
			el.removeChild(target);
			let xDir = parseInt(target.getAttribute('xDir'));
			let yDir = parseInt(target.getAttribute('yDir'));
			let xPos = target.style.left.replace('%','');
			let yPos = target.style.top.replace('%','');
			//console.log('old', xPos, yPos, xDir, yDir);
			
			xPos = parseInt(xPos) + parseInt(xDir);
			target.style.left = xPos + '%';
			if( (xPos >= 100) || (xPos <= 0) ){
			xPos = parseInt(xPos) - parseInt(xDir);
			target.style.left = xPos + '%';
			target.setAttribute('xDir', -xDir);
			}
			
			yPos = parseInt(yPos) + parseInt(yDir);
			target.style.top = yPos + '%'; 
			if( (yPos >= 100) || (yPos <= 0) ){
			yPos = parseInt(yPos) - parseInt(yDir);
			target.style.top = yPos + '%';
			target.setAttribute('yDir', -yDir);
			}
			
			//console.log('new', xPos, yPos, xDir, yDir);
			el.appendChild(target);
		}
		
		//RESET TIMEOUT
		this.moveTimer = setTimeout(this.moveTarget.bind(this),25);
	}
	
	lose()
	{
		let result = document.createElement('h1');
		result.innerHTML = 'lose!';
		document.getElementById('main').appendChild(result);
		super.lose();
	}
	
	win()
	{
		let result = document.createElement('h1');
		let endTime = new Date();
		let duration = endTime - this.startTime;
		result.innerHTML = 'win - took ' + duration + 'ms!';
		document.getElementById('main').appendChild(result);
		super.win();
	}
}