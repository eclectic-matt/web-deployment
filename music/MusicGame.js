class MusicGame 
{
    type = "key";
    difficulty = "easy";
    lives = 3;
    level = 0;
    notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    
    setType = (type) => {
        this.type = type;
    }
    
    setDifficulty = (difficulty) => {
        this.difficulty = difficulty;
    }
    
    start = () => {
    	this.lives = 3;
    	this.level = 0;
        this.getNewQuestion();
    }
    
    getNewQuestion = () => {
    	this.level += 1;
    	let questionData = {};
    	switch(this.type){
            case 'key':
                questionData = this.getNewKeyQuestion();
            break;
            case 'scale':
                questionData = this.getNewScaleQuestion();
            break;
            case 'pitch':
            default:
                questionData = this.getNewPitchQuestion();
            break;
        }
        this.updateUi(questionData);
    }
    
    getNewScaleQuestion = () => {
        //Play a scale and give options (difficulties determine scales and shuffled notes)
        let options, answer, key, question = '';
        switch(this.difficulty){
            case 'easy':
            default:
                //major, in order
                options = [
                	'major',
                	'minor',
                	'majorPentatonic',
                	'minorPentatonic'
            	];
                answer = options[Math.floor(Math.random() * options.length)];
                //key = 'C';
                key = this.notes[Math.floor(Math.random() * this.notes.length)];
                question = 'What scale is this (key: ' + key + ')?';
            break;
            case 'medium':
                //other scales, in order
				options = [
					'major',
					'minor',
					'harmonicMajor',
					'harmonicMinor',
					'bluesMinorPentatonic',
					'bluesMajorPentatonic',
					'majorPentatonic',
					'minorPentatonic',
					'tritone',
					'wholeTone'
				];
				//GET A SMALLER LIST OF OPTIONS, INCLUDING THE CORRECT ANSWER
				answer = options[Math.floor(Math.random() * options.length)];
				options = this.getOptions(4, options, answer);
				key = this.notes[Math.floor(Math.random() * this.notes.length)];
				//key = 'C';
				question = 'What scale is this (key: ' + key + ')?';
            break;
            case 'hard':
                //other scales, NOT in order?
                options = [
                	'istrian',
                	'locrian',
                	'phrygian', 
                	'mixolydian', 
                	'augmented', 
                	'dorian', 
                	'doubleHarmonic', 
                	'enigmatic', 
                	'harmonicMajor', 
                	'harmonicMinor', 
                	'bluesMinorPentatonic',
                	'bluesMajorPentatonic', 
                	'persian', 
                	'prometheus', 
                	'scaleOfHarmonics', 
                	'tritone', 
                	'wholeTone', 
                	'ukranianDorian', 
                	'yo'
                ];
                //GET A SMALLER LIST OF OPTIONS, INCLUDING THE CORRECT ANSWER
                answer = options[Math.floor(Math.random() * options.length)];
                options = this.getOptions(4, options, answer);
                key = this.notes[Math.floor(Math.random() * this.notes.length)];
                //key = 'C';
                question = 'What scale is this (key: ' + key + ')?';
            break;
        }
        
        //Return data obj
        return {
        	key: key,
        	question: question,
        	answer: answer,
        	options: options,
        	scale: answer
        }
    }
    
    getNewKeyQuestion = () => {
        //Play a scale and give options (difficulties determine scales and shuffled notes)
        let options, scale, answer, key, question = '';
        switch(this.difficulty){
            case 'easy':
            default:
                //major, in order
                options = [
                	'A','B','C','D','E','F'
            	];
                answer = options[Math.floor(Math.random() * options.length)];
                key = answer;
                scale = 'major';
                //key = 'C';
                //key = this.notes[Math.floor(Math.random() * this.notes.length)];
                question = 'What key is this?';
            break;
            case 'medium':
                //other scales, in order
				options = [
					'major',
					'minor',
					'harmonicMajor',
					'harmonicMinor',
					'bluesMinorPentatonic',
					'bluesMajorPentatonic',
					'majorPentatonic',
					'minorPentatonic',
					'tritone',
					'wholeTone'
				];
				//GET A SMALLER LIST OF OPTIONS, INCLUDING THE CORRECT ANSWER
				answer = options[Math.floor(Math.random() * options.length)];
				options = this.getOptions(4, options, answer);
				key = this.notes[Math.floor(Math.random() * this.notes.length)];
				//key = 'C';
				scale = 'major';
				question = 'What scale is this (key: ' + key + ')?';
            break;
            case 'hard':
                //other scales, NOT in order?
                options = [
                	'istrian',
                	'locrian',
                	'phrygian', 
                	'mixolydian', 
                	'augmented', 
                	'dorian', 
                	'doubleHarmonic', 
                	'enigmatic', 
                	'harmonicMajor', 
                	'harmonicMinor', 
                	'bluesMinorPentatonic',
                	'bluesMajorPentatonic', 
                	'persian', 
                	'prometheus', 
                	'scaleOfHarmonics', 
                	'tritone', 
                	'wholeTone', 
                	'ukranianDorian', 
                	'yo'
                ];
                //GET A SMALLER LIST OF OPTIONS, INCLUDING THE CORRECT ANSWER
                answer = options[Math.floor(Math.random() * options.length)];
                options = this.getOptions(4, options, answer);
                key = this.notes[Math.floor(Math.random() * this.notes.length)];
                //key = 'C';
                scale = 'major';
                question = 'What scale is this (key: ' + key + ')?';
            break;
        }
        
        //Return data obj
        return {
        	key: key,
        	question: question,
        	answer: answer,
        	options: options,
        	scale: scale
        }
    }
    
    getNewPitchQuestion = () => {
    	//Play a scale and give options (difficulties determine scales and shuffled notes)
    	let options, answer, key, question = '';
    	switch (this.difficulty) {
    		case 'easy':
    		default:
    			//major, in order
    			options = [
                    	'major',
                    	'minor',
                    	'majorPentatonic',
                    	'minorPentatonic'
                	];
    			answer = options[Math.floor(Math.random() * options.length)];
    			//key = 'C';
    			key = this.notes[Math.floor(Math.random() * this.notes.length)];
    			question = 'What scale is this (key: ' + key + ')?';
    			break;
    		case 'medium':
    			//other scales, in order
    			options = [
    					'major',
    					'minor',
    					'harmonicMajor',
    					'harmonicMinor',
    					'bluesMinorPentatonic',
    					'bluesMajorPentatonic',
    					'majorPentatonic',
    					'minorPentatonic',
    					'tritone',
    					'wholeTone'
    				];
    			//GET A SMALLER LIST OF OPTIONS, INCLUDING THE CORRECT ANSWER
    			answer = options[Math.floor(Math.random() * options.length)];
    			options = this.getOptions(4, options, answer);
    			key = this.notes[Math.floor(Math.random() * this.notes.length)];
    			//key = 'C';
    			question = 'What scale is this (key: ' + key + ')?';
    			break;
    		case 'hard':
    			//other scales, NOT in order?
    			options = [
                    	'istrian',
                    	'locrian',
                    	'phrygian',
                    	'mixolydian',
                    	'augmented',
                    	'dorian',
                    	'doubleHarmonic',
                    	'enigmatic',
                    	'harmonicMajor',
                    	'harmonicMinor',
                    	'bluesMinorPentatonic',
                    	'bluesMajorPentatonic',
                    	'persian',
                    	'prometheus',
                    	'scaleOfHarmonics',
                    	'tritone',
                    	'wholeTone',
                    	'ukranianDorian',
                    	'yo'
                    ];
    			//GET A SMALLER LIST OF OPTIONS, INCLUDING THE CORRECT ANSWER
    			answer = options[Math.floor(Math.random() * options.length)];
    			options = this.getOptions(4, options, answer);
    			key = this.notes[Math.floor(Math.random() * this.notes.length)];
    			//key = 'C';
    			question = 'What scale is this (key: ' + key + ')?';
    			break;
    	}
    
    	//Return data obj
    	return {
    		key: key,
    		question: question,
    		answer: answer,
    		options: options
    	}
    }
    
    
    
    
    
    updateUi = (data) => {
        console.log('ui', data);
        //Play the scale and show div of answers
        let music = new Music();
        music.playScale(data.key, data.answer, 250);
        
        const out = document.getElementById('gameOutput');
        out.innerHTML = null;
        
        const wrap = document.createElement('div');
        
        const hud = document.createElement('p');
        hud.id = 'hud';
        wrap.appendChild(hud);
        
        const head = document.createElement('h4');
        head.innerHTML = data.question;
        wrap.appendChild(head);
        
        for(let i = 0; i < data.options.length; i++){
            let ansBtn = document.createElement('button');
            ansBtn.innerHTML = data.options[i];
            ansBtn.className = 'answer';
            if(data.options[i] === data.answer){
                //ansBtn.style.backgroundColor = '#0f0';
                ansBtn.onclick = function(){
                    alert('correct!');
                    this.getNewQuestion();
                }.bind(this);
            }else{
                ansBtn.onclick = function() {
                    alert('wrong!');
                    this.loseLife();
                }.bind(this);
            }
            wrap.appendChild(ansBtn);
        }

		//ADD A "PLAY AGAIN" BUTTON?
		let playAgainBtn = document.createElement('button');
		playAgainBtn.innerHTML = 'Play Scale Again';
		playAgainBtn.style.backgroundColor = '#00f';
		playAgainBtn.style.color = '#fff';
		playAgainBtn.style.margin = '10% 5%';
		playAgainBtn.onclick = function(){
			let music = new Music();
			music.playScale(data.key, data.scale, 250);
		}
		wrap.appendChild(playAgainBtn);

        out.appendChild(wrap);
        this.updateHud();
    }
    
    updateHud = () => {
    	const hud = document.getElementById('hud');
    	hud.innerHTML = '';
    	let level = document.createElement('span');
    	level.id = 'level';
    	level.innerHTML = 'LEVEL: ' + this.level;
    	hud.appendChild(level);
    	let lives = document.createElement('span');
    	lives.id = 'lives';
    	lives.innerHTML = "LIVES: " + "❤️".repeat(this.lives);
    	hud.appendChild(lives);
    	//hud.innerHTML = 'LEVEL: ' + this.level + '   LIVES: ' + this.lives;
    }
    
    startPitchGame = () => {
        //Play a pitch and give options for the played pitch (difficulties determine spread of options?)
    }
    
    loseLife = () => {
    	this.lives -= 1;
    	this.updateHud();
    	if(this.lives <= 0){
    		alert('Out of lives');
    		showTab('gameSetup');
    	}
    }

	getOptions = (count, list, correct) => {
		let returnOpts = [];
		returnOpts.push(correct);
		let correctIndex = list.indexOf(correct);
		//REMOVE THE CORRECT ANSWER FROM THE LIST
		list.splice(list.indexOf(correct), 1);
		//console.log('options', correct);

		//ITERATE FROM 0 TO COUNT-1 (CORRECT WILL BE OPTION 0)
		for(let i = 0; i < count - 1; i++){
			let randomIndex = correctIndex;
			while(randomIndex == correctIndex){
				randomIndex = Math.floor(Math.random() * list.length);
				//console.log('while', i, randomIndex, correctIndex);
				//IF WE ALREADY HAVE THIS OPTION
				if(returnOpts.includes(list[randomIndex])){
					//FORCE IT TO CHECK AGAIN
					randomIndex = correctIndex;
				}
			}
			let selectedOption = list.splice(randomIndex, 1);
			//console.log('optSelected', i, selectedOption[0]);
			returnOpts.push(selectedOption[0]);
		}
		//console.log('Generated options', returnOpts);
		//SHUFFLE THE ARRAY 
		return shuffle(returnOpts);
	}
}


const shuffle = (a) => {
	var j, x, i;
	for (i = a.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		x = a[i];
		a[i] = a[j];
		a[j] = x;
	}
	return a;
}
