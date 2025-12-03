class NoteManager
{
    roleCounts = [
        undefined, //1
        undefined, //2
        undefined, //3
        undefined, //4
        { //5
            townsfolk: 3,
            outsider: 0,
            minion: 1,
            demon: 1,
            traveler: 0
        },
        { //6
            townsfolk: 3,
            outsider: 1,
            minion: 1,
            demon: 1,
            traveler: 0
        },
        { //7
            townsfolk: 5,
            outsider: 0,
            minion: 1,
            demon: 1,
            traveler: 0
        },
        { //8
            townsfolk: 5,
            outsider: 1,
            minion: 1,
            demon: 1,
            traveler: 0
        },
        { //9
            townsfolk: 5,
            outsider: 2,
            minion: 1,
            demon: 1,
            traveler: 0
        },
        { //10
            townsfolk: 7,
            outsider: 0,
            minion: 2,
            demon: 1,
            traveler: 0
        },
        { //11
            townsfolk: 7,
            outsider: 1,
            minion: 2,
            demon: 1,
            traveler: 0
        },
        { //12
            townsfolk: 7,
            outsider: 2,
            minion: 2,
            demon: 1,
            traveler: 0
        },
        { //13
            townsfolk: 9,
            outsider: 0,
            minion: 3,
            demon: 1,
            traveler: 0
        },
        { //14
            townsfolk: 9,
            outsider: 1,
            minion: 3,
            demon: 1,
            traveler: 0
        },
        { //15
            townsfolk: 9,
            outsider: 2,
            minion: 3,
            demon: 1,
            traveler: 0
        },
        { //16
            townsfolk: 9,
            outsider: 2,
            minion: 3,
            demon: 1,
            traveler: 1
        },
        { //17
            townsfolk: 9,
            outsider: 2,
            minion: 3,
            demon: 1,
            traveler: 2
        },
        { //18
            townsfolk: 9,
            outsider: 2,
            minion: 3,
            demon: 1,
            traveler: 3
        },
        { //19
            townsfolk: 9,
            outsider: 2,
            minion: 3,
            demon: 1,
            traveler: 4
        },
        { //20
            townsfolk: 9,
            outsider: 2,
            minion: 3,
            demon: 1,
            traveler: 5
        }
    ];

    //PROPERTIES
    //this.settings
    //this.players
    //this.roles
    //this.elements

    //===========================
    // INIT / SETUP METHODS 
    //============================

	constructor()
	{
		//Check for saved state
		if(this.hasData()){
			this.loadState();
		}else{
			this.setDefaultState();
		}
	}

    init()
    {
        this.setupWindowElements();
        this.setupUi();
    }

    setupWindowElements()
    {
        //Init elements object
        this.elements = {};
        //Store references to key elements
        this.elements.main = document.getElementById('main');
        this.elements.setupWindow = document.getElementById('setupWindow');
        this.elements.addRoleWindow = document.getElementById('addRoleWindow');
        this.elements.central = document.getElementById('central');
    }
	
	async setDefaultState()
	{
		//Settings
		this.createSettingsObject();
        //Roles
        await this.createRolesObject();
        //Players
        this.createPlayersObject();

        this.addRoleBtnText = "Edit";
		this.pencilIconUnicode = "&#9998;";
	}

    createSettingsObject()
    {
        this.settings = {
            script: 'tb',
            playerCount: 5
        }
    }

    async createRolesObject()
    {
        //ROLES: allRoles is every possible role, loaded on init
        this.roles = {
            allRoles: await this.getAllRoles(),
            scriptRoles: []
        }
    }

    createPlayersObject()
    {
        //Init array
        this.players = [];
        for(let i = 1; i <= this.settings.playerCount; i++)
		{
            //Add new player object to array
			this.players.push({
				name: 'p' + i,
				seat: i,
				roles: [],
				living: true,
				deadVote: true,
				alignment: 'good',
				notes: ''
			});
		}
    }

    adjustPlayerCount(newPlayerCount)
    {
        if(this.players.length < newPlayerCount)
	    {
            //Add players to array
            for(let i=this.players.length; i<newPlayerCount; i++)
            {
                this.players.push({
                    name: 'p' + i,
                    seat: i,
                    roles: [],
                    living: true,
                    deadVote: true,
                    alignment: 'good',
                    notes: ''
                });
            }
        }
        else
        {
            //Remove players from the array
            let pCopy = this.players;
            pCopy.splice(newPlayerCount);
            this.players = pCopy;
        }
    }

    async getAllRoles()
    {
        let allRoles = await fetch('./roles.json');
	    return await allRoles.json();
    }

    setScript(scriptName)
    {
        if(scriptName != "all")
	    {
		    //Filter to edition
		    scriptRoles = scriptRoles.filter((r) => { return r.edition == scriptName;});
	    }else
        {
            this.scriptRoles = this.allRoles;
        }
    }
	
	//Setup user interface
	setupUi()
	{
		this.createPlayerTokens();
        this.createRolesWindow();
	}

    //===========================
    // SAVE / LOAD METHODS 
    //============================
	
    //Save data 
	save()
	{
		//Save to local storage
        try{
            localStorage.setItem("players", JSON.stringify(playersObj));
        }catch(ex){
            console.log(ex);
        }
    }
	
	//Load data
	loadState()
	{
		//Load from local storage
        try{
            playersObj = JSON.parse(localStorage.getItem("players"));
        }catch(ex){
            console.log(ex);
        }
	}

	hasData()
    {
		//Bool test
		let boolData = false;
        try {
            //Bool test
            boolData = localStorage.getItem("players");
        }catch(ex){
            console.log(ex);
        }
        return boolData;
	}

    //===========================
    // UI METHODS 
    //============================
    setupPlayerTokens()
    {
        //Get reference to main
        let main = this.elements.main;
        //Clear main between runs
        main.innerHTML = null;

        let [w, h, r] = this.calcScreenDimensions();
        //Calculate fixed values
        let centerAdjustX = -50;
        let centerAdjustY = 25;
        let cx = (0.5 * w) + centerAdjustX;
        let cy = (0.5 * h) + centerAdjustY;
        let eclipseWidth = w / 3;
        let eclipseHeight = h / 3;
        let shortestSide = Math.min(w, h);
        let elementRadius = Math.floor((1.1 * shortestSide) / (0.6 * this.players.length));
       	elementRadius = Math.min(Math.max(elementRadius, tMin), tMax);	

        //Create player elements
        for (let i = 0; i < this.players.length; i++)
        {
            let el = document.createElement('div');
            el.style.position = "absolute";
            el.style.width = elementRadius + 'px';
            el.style.height = elementRadius + 'px';
            //Calculate position for each token
            //- angle is 2PI split into playerCount sections, rotated along by PI/2 (due east is 0deg, want due south)
            let angle = i * (2 * Math.PI / this.players.length) + (Math.PI / 2);

            let point = getPointInEclipse(cx, cy, eclipseWidth, eclipseHeight, angle);
            let x = point.x;
            let y = point.y;

            console.log('i',i);
            console.log('cx',cx);
            console.log('cy',cy);
            console.log('ew',eclipseWidth);
            console.log('eh',eclipseHeight);
            console.log('point.x',x);
            console.log('point.y',y);
            console.log('angle',angle);
            
            let left = x + 'px';
            let top = y + 'px';
            
            //debug(i + ' => ' + x + ', ' + y + ' => ' + left + ', ' + top);
            el.style.top = top;
            el.style.left = left;
            
            //console.log(i, angle, x, y);
            el.className = "player";
            el.id = "player" + (i + 1);
            el.dataset.player = i;
            //ALIGNMENT
            if(this.players[i].alignment == 'Evil')
            {
                //el.style.borderColor = 'red';
                el.classList.add('evil');
                el.classList.remove('good');
            }else{
                //el.style.borderColor = 'green';
                el.classList.add('good');
                el.classList.remove('evil');
            }
            
            //Death shroud?
            let deathShroud = document.createElement('div');
            deathShroud.id = "player" + i + "Shroud";
            deathShroud.className = 'shroud';
            deathShroud.style.width = '60%';
            deathShroud.style.marginLeft = '20%';
            deathShroud.style.marginTop = '10%';
            deathShroud.style.marginBottom = 0;
            deathShroud.style.height = '0.75rem';
            deathShroud.style.backgroundColor = 'red';
            deathShroud.style.color = 'white';
            deathShroud.style.fontSize = '0.5rem';
            deathShroud.style.textAlign = 'center';
            deathShroud.innerHTML = 'DEAD';
            //Not "living" => show death shroud
            if(this.players[i] && !this.players[i].living)
            {
                //deathShroud.style.display = 'block';
                //el.style.filter = 'grayscale(100%)';
                el.classList.remove('living');
                el.classList.add('dead');
            }else{
                //deathShroud.style.display = 'none';
                el.classList.remove('dead');
                el.classList.add('living');
            }
            if(this.players[i] && this.players[i].voteUsed)
            {
                deathShroud.innerHTML += ' (no vote)';
            }
            deathShroud.style.zIndex = 100;
            el.appendChild(deathShroud);
            let addBtn = document.createElement('button');
            if(this.players[i] && this.players[i].roles.length > 0)
            {
                addBtn.innerHTML = this.players[i].roles.join(', ');
            }else{
                addBtn.innerHTML = addRoleBtnText;
            }
            if(this.players[i] && this.players[i].notes.length > 0)
            {
                addBtn.innerHTML += pencilIconUnicode;
            }
            addBtn.style.marginTop = '5%';
            addBtn.style.fontSize = Math.floor(shortestSide / 50) + 'px';
            addBtn.className = "addBtn";
            addBtn.onclick = () => openPlayerEditWindow(addBtn);
            addBtn.id = "player" + i + "Roles";
            el.appendChild(addBtn);
            let nameInput = document.createElement('input');
            nameInput.onchange = () => setPlayerName(nameInput);
            nameInput.type = "text";
            //NOTE: these default to player1 - player20 so this should always be true
            if (this.players[i] && this.players[i].name.length > 0) {
                //console.log('setting the name of player ' + i + ' to ' + playersObj.players[i].name);
                nameInput.value = this.players[i].name;
                nameInput.innerHTML = this.players[i].name;
            } else {
                nameInput.value = "p" + i;
            }
            nameInput.className = "nameInput";
            el.appendChild(nameInput);
            main.appendChild(el);
        }
        
        createCentralBox();
    }

    createCentralBox()
    {
        //Get reference to element
        let central = this.elements.central;
        //Clear between runs
        central.innerHTML = null;
        //Output the day 
        central.innerHTML += 'Day <span id="currentDay">1</span>';
        central.innerHTML += '<br>';
        //Living players
        central.innerHTML += greenDotUnicode + ': <span id="livingPlayersSpan">' + this.players.length + '</span>';
        //Votes used
        central.innerHTML += handRaiseUnicode + ': <span id="votesSpan">' + this.players.length + '</span>';
        //Role counts for the current player count
        let roleCount = this.roleCounts[this.players.length - 1];
        central.innerHTML += '<br>';
        //Iterate over teams
        Object.keys(roleCount).forEach((team) => 
        {
            //Get count from players array
            let currentCount = getCurrentRoleCount(team);
            if(currentCount < roleCount[team])
            {
                central.innerHTML += '&uarr; ';
            }else if(currentCount > roleCount[team]){
                central.innerHTML += '&darr; ';
            }else{
                central.innerHTML += '= ';
            }
            central.innerHTML += roleCount[team] + " " + team + (roleCount[team] != 1 ? 's' : '') + "<br>";
        });
    }

    getCurrentRoleCount(team)
    {
        let currentCount = 0;
        for(let i = 0; i < this.players.length; i++)
        {
            //ONLY COUNT IF A SINGLE ROLE IS SET ON THIS PLAYER
            if(this.players[i].roles.length == 1){
                //Load the role
                let role = this.allRoles.filter((r) => {return r.name == this.players[i].roles[0];});
                if(role.team == team){
                    roleCount++;
                    break;
                }
            }
        }
        return currentCount;
    }


    //=====================
    // UTILITY METHODS
    //=====================
    calcScreenDimensions()
    {
        let w = window.innerWidth;
        //Now 100%
        let h = window.innerHeight;
        //Radius of tokens
        let r = 0.1 * h;
        //let values = [w, h];
        return [w, h, r];
    }

}