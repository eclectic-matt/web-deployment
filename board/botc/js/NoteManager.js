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

	constructor()
	{
		//Check for saved state
		if(this.hasData()){
			this.loadState();
		}else{
			this.setDefaultState();
		}
	}
	
	setDefaultState()
	{
		//Settings
		this.script = "tb";
		this.allRoles = [];
		this.scriptRoles = [];
		this.playersObj = {
			settings: {},
			players: []
		}
		this.addRoleBtnText = "Edit";
		this.pencilIconUnicode = "&#9998;";
		
	}
	
	//Setup elements (by playerCount)
	setup(pCount)
	{
		
	}
	//Save data 
	save()
	{
		//Save to local storage
		
	}
	//Load data
	loadState()
	{
		//Load from local storage
		
	}
	hasData(){
		//Bool test
		return localStorage.getItem("players");
	}
}