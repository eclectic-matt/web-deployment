class MusicGame 
{
    type = "key";
    difficulty = "easy";
    
    setType = (type) => {
        this.type = type;
    }
    
    setDifficulty = (difficulty) => {
        this.difficulty = difficulty;
    }
    
    start = () => {
        switch(this.type){
            case 'key':
                this.startKeyGame();
            break;
            case 'scale':
                this.startScaleGame();
            break;
            case 'pitch':
            default:
                this.startPitchGame();
            break;
        }
    }
    
    startKeyGame = () => {
        //PLAY SOME NOTES (NOT IN ORDER AT HIGHER DIFFICULTIES) AND DETERMINE THE KEY (MULTIPLE CHOICE AT LOWER DIFFICULTIES)
        switch(this.difficulty){
            case 'easy':
            default:
                //major, in order
                
            break;
            case 'medium':
                //other scales, in order
                
            break;
            case 'hard':
                //
            break;
        }
    }
    
	/**
	 * 'major','minor','chromatic','istrian','locrian','phrygian','mixolydian','augmented','dorian','doubleHarmonic','enigmatic','harmonicMajor','harmonicMinor','majorPentatonic','minorPentatonic','bluesMinorPentatonic','bluesMajorPentatonic','persian','prometheus','scaleOfHarmonics','tritone','wholeTone','ukranianDorian','yo'
	 */
    startScaleGame = () => {

		const notes = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
        //Play a scale and give options (difficulties determine scales and shuffled notes)
        let options, answer, key, question = '';
        switch(this.difficulty){
            case 'easy':
            default:
                //major, in order
                options = ['major', 'minor', 'majorPentatonic', 'minorPentatonic'];
                answer = options[Math.floor(Math.random() * options.length)];
                key = 'C';
                question = 'What scale is this (key: ' + key + ')?';
            break;
            case 'medium':
                //other scales, in order
				options = ['istrian','locrian','phrygian','mixolydian','augmented','dorian','doubleHarmonic','enigmatic','harmonicMajor','harmonicMinor','bluesMinorPentatonic','bluesMajorPentatonic','persian','prometheus','scaleOfHarmonics','tritone','wholeTone','ukranianDorian','yo'];
				//GET A SMALLER LIST OF OPTIONS, INCLUDING THE CORRECT ANSWER
				answer = options[Math.floor(Math.random() * options.length)];
				options = this.getOptions(4, options, answer);
				key = notes[Math.floor(Math.random() * notes.length)];
				//key = 'C';
				question = 'What scale is this (key: ' + key + ')?';
            break;
            case 'hard':
                //other scales, NOT in order?

            break;
        }
        
        //Play the scale and show div of answers
        let music = new Music();
        music.playScale(key, answer, 250);
        
        const out = document.getElementById('gameOutput');
        out.innerHTML = null;
        
        const wrap = document.createElement('div');
        
        const head = document.createElement('h4');
        head.innerHTML = question;
        wrap.appendChild(head);
        
        for(let i = 0; i<options.length; i++){
            let ansBtn = document.createElement('button');
            ansBtn.innerHTML = options[i];
            if(options[i] === answer){
                //ansBtn.style.backgroundColor = '#0f0';
                ansBtn.onclick = function(){
                    alert('correct!');
                }
            }else{
                ansBtn.onclick = function() {
                        alert('wrong!');
                }
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
			music.playScale(key, answer, 250);
		}
		wrap.appendChild(playAgainBtn);

        out.appendChild(wrap);
    }
    
    startPitchGame = () => {
        //Play a pitch and give options for the played pitch (difficulties determine spread of options?)
    }

	getOptions = (count, list, correct) => {
		let returnOpts = [];
		returnOpts.push(correct);
		let correctIndex = list.indexOf(correct);
		//REMOVE THE CORRECT ANSWER FROM THE LIST
		list.splice(list.indexOf(correct), 1);

		//ITERATE FROM 0 TO COUNT-1 (CORRECT WILL BE OPTION 0)
		for(let i = 0; i < count - 1; i++){
			let randomIndex = list.indexOf(correct); 
			while(randomIndex == correctIndex){
				randomIndex = Math.floor(Math.random() * list.length);
				//IF WE ALREADY HAVE THIS OPTION
				if(returnOpts.includes(list[randomIndex])){
					//FORCE IT TO CHECK AGAIN
					randomIndex = correctIndex;
				}
			}
			let selectedOption = list.splice(randomIndex, 1);
			returnOpts.push(selectedOption[0]);
		}
		console.log('Generated options', returnOpts);
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
