class Die 
{
        faces = [];
        sides = 6;
        name = '';
        value = undefined;
        rollCount = 0;
        selected = false;

        constructor(sides=6, faces=false)
        {
                //THE TOTAL NUMBER OF POSSIBLE VALUES, FROM 1 - sides
                this.sides = sides;
                //THE CURRENT VALUE, INIALISED TO THE MAX VALUE (CHANGE WITH THE .roll() METHOD)
                this.value = sides;
                //IF AN ARRAY OF FACES WAS SUPPLIED
                if(faces){
                        this.name = 'Upgraded D' + sides;
                        this.faces = faces;
                        this.sides = faces.length;
                }else{
                        this.name = 'Starting D' + sides;
                        this.initFaces();
                }
        }

        initFaces()
        {
                //START WITH AN EMPTY ARRAY
                this.faces = [];
                //ITERATE FROM 1 UP TO sides
                for(let i = 1; i <= this.sides; i++){
                        //ADD A FACE WITH VALUE = i AND THE DEFAULT MODIFIER
                        this.faces.push({
                                value: i,
                                modifier: 1
                        });
                }
                //console.log(this.name, this.faces);
        }

        roll()
        {
                this.rollCount++;
                const faceIndex = Math.floor(Math.random() * this.sides);
                this.value = this.faces[faceIndex].value;
        }
        
        alertScore(scoreString)
        {
        	let dieScoreElId = this.name.replace(' ', '_') + '_Tooltip';
			let dieScoreEl = document.getElementById(dieScoreElId);
			dieScoreEl.classList.add('flash');
			dieScoreEl.classList.remove('flash');
			dieScoreEl.innerHTML = scoreString;
        }
}