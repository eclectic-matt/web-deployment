var focus = true; 
var blurTime = 0;

var obj_time = {};
var obj_player = {};

var obj_mines = {};
var obj_rigs = {};
var obj_refineries = {};
/* ADD_MORE_FACILITIES */

var STARTING_CASH, TIMEOUT;
var t;

var tenLevels = [10,20,30,40,50,60,70,80,90,100]; //ALL
var fifteenLevels = [15,30,45,60,75,90,105,120,135,150]; // REFINERIES
var twentyLevels = [20,40,60,80,100,120,140,160,180,200]; // RIGS
var twentyFiveLevels = [25,50,75,100,125,150,175,200,225,250]; // MINES

				// 0  3   6   9  12   15   18   21   24   27   30   33   36
var largeList = [ "","K","M","B","T","Qu","Qi","Sx","Sp","Oc","No","De","UD","DD","TD","qD","QD","sD","SD","OD","ND" ]; // https://en.wikipedia.org/wiki/Names_of_large_numbers
var timeSuffixes = [ "secs", "mins", "hours", "days", "years", "millenia" ];
var timeDivides = [    59,   3599,   86399,  31535999, 31535999999, 9e99 ];

var efficiency = {};
var interest_multiplier = 0;	// Gets added on following facilities income (multiplies current cash, so set at 0)

var achievements = [
	{
		"name": "Reach £1 Trillion(T) lifetime earnings",
		"check": 'obj_player.earned',
		"value": 1e12,
		"achieved": 0
	},
	{
		"name": "Buy 50 Mines",
		"check": 'obj_mines.count',
		"value": 50,
		"achieved": 0
	},
	{
		"name": "Reach the ALL 10 boost",
		"check": 'efficiency.boostLevel',
		"value": 1,
		"achieved": 0
	},
	{
		"name": "Reach £1 Septillion(Sp) lifetime earnings",
		"check": 'obj_player.earned',
		"value": 1e24,
		"achieved": 0
	},
	{
		"name": "Buy 50 Oil Rigs",
		"check": 'obj_rigs.count',
		"value": 50,
		"achieved": 0
	},
	{
		"name": "Reach the ALL 20 boost",
		"check": 'efficiency.boostLevel',
		"value": 2,
		"achieved": 0
	},
	{
		"name": "Reach £1 Decillion(De) lifetime earnings",
		"check": 'obj_player.earned',
		"value": 1e33,
		"achieved": 0
	},
	{
		"name": "Reach the ALL 30 boost",
		"check": 'efficiency.boostLevel',
		"value": 3,
		"achieved": 0
	},
	{
		"name": "Reach the ALL 40 boost",
		"check": 'efficiency.boostLevel',
		"value": 4,
		"achieved": 0
	},
	{
		"name": "Reach the ALL 50 boost",
		"check": 'efficiency.boostLevel',
		"value": 5,
		"achieved": 0
	}
];
	
function init(resetProgress){
	
	resetProgress = resetProgress || false;
	if (!resetProgress){
		efficiency.boost = 1;
		efficiency.boostLevel = 0;
		efficiency.boostLevels = tenLevels;
		obj_time.elapsed = 0;
		obj_player.earned = 0;
	}
	
	STARTING_CASH = 1e1;
	TIMEOUT = 100;
	obj_player.cash = STARTING_CASH;
		
	largeNumbers = duplicateElements(largeList, 3);
			
	obj_mines.cost = 10;
	obj_mines.earnings = 1;
	obj_mines.count = 1;
	obj_mines.costMultiplier = 1.9;
	obj_mines.earningsExponent = 2.5;
	obj_mines.boost = 1;
	obj_mines.boostLevel = 0;
	obj_mines.boostLevels = twentyFiveLevels;
	
	obj_rigs.cost = 1e6;
	obj_rigs.earnings = 1e4;
	obj_rigs.count = 0;
	obj_rigs.costMultiplier = 2.3;
	obj_rigs.earningsExponent = 2.9;
	obj_rigs.boost = 1;
	obj_rigs.boostLevel = 0;
	obj_rigs.boostLevels = twentyLevels;
	
	obj_refineries.cost = 1e10;
	obj_refineries.earnings = 3e8;
	obj_refineries.count = 0;
	obj_refineries.costMultiplier = 3.4;
	obj_refineries.earningsExponent = 3.5;
	obj_refineries.boost = 1;
	obj_refineries.boostLevel = 0;	
	obj_refineries.boostLevels = fifteenLevels;
	
	/* ADD_MORE_FACILITIES */
	
	generateLevelIcons();
	generateAchievementIcons();
	
	step();
}

function generateAchievementIcons(){
	
	var achievementsDiv = document.getElementById('achievementsDiv');
	var rowDiv = document.createElement('div');
	rowDiv.classList.add('w3-row-padding');
	var halfDiv = document.createElement('div');
	halfDiv.classList.add('w3-half');
	halfDiv.classList.add('w3-xxlarge');
	
	for (var i = 0; i < achievements.length; i++){
		
		var thisAchievement = document.createElement('span');
		thisAchievement.classList.add('w3-tooltip');
		thisAchievement.classList.add('unselect');
		thisAchievement.innerHTML = ( i + 1 );
		thisAchievement.id = 'achievementIcon' + i;
		thisAchievement.classList.add('w3-badge');
		thisAchievement.classList.add('w3-amber');
		thisAchievement.classList.add('w3-large');
		thisAchievement.classList.add('w3-border');
		//thisAchievement.classList.add('w3-circle');
		//thisAchievement.style.padding = '15px 10px';
		thisAchievement.style.margin = '10px';
		thisAchievement.classList.add('w3-hover-yellow');
		thisAchievement.classList.add('w3-round-xxlarge');
		
		thisTooltip = document.createElement('p');
		thisTooltip.id = 'achievementTooltip' + i;
		thisTooltip.classList.add('w3-text');
		thisTooltip.style.position = 'absolute';
		thisTooltip.style.left = '-50px';
		thisTooltip.style.top = '25px';
		thisTooltip.style.width = '150px';
		thisTooltip.style.zIndex = '50';
		thisTooltip.classList.add('w3-purple');
		thisTooltip.classList.add('w3-border');
		
		thisTooltip.innerHTML = 'Description: ' + achievements[i].name;
		
		thisAchievement.appendChild(thisTooltip);
		halfDiv.appendChild(thisAchievement);
		
		if (i === 4){
				rowDiv.appendChild(halfDiv);
	
				halfDiv = document.createElement('div');
				halfDiv.classList.add('w3-half');
				halfDiv.classList.add('w3-xxlarge');
		}
	}
	
	rowDiv.appendChild(halfDiv);
	achievementsDiv.appendChild(rowDiv);
}

function generateLevelIcons(){
	// MINES
	var thisElement = document.getElementById('minesLevels');
	var thisId = 'minesBoost';
	var boostObj = obj_mines;
	generateLevels(thisElement,thisId,boostObj);
	// RIGS
	thisElement = document.getElementById('rigsLevels');
	thisId = 'rigsBoost';
	boostObj = obj_rigs;
	generateLevels(thisElement,thisId,boostObj);
	//REFINERIES
	thisElement = document.getElementById('refineriesLevels');
	thisId = 'refineriesBoost';
	boostObj = obj_refineries;
	generateLevels(thisElement,thisId,boostObj);
	// ALL
	thisElement = document.getElementById('allLevels');
	thisId = 'allBoost';
	boostObj = efficiency;
	generateLevels(thisElement,thisId,boostObj);
}

function generateLevels(thisElement,thisId,boostObj){
	thisElement.innerHTML = "";
	for (var i = 0; i < boostObj.boostLevels.length; i++){
		var thisBoost = document.createElement('span');
		thisBoost.innerHTML = boostObj.boostLevels[i];
		thisBoost.id = thisId + i;
		thisBoost.style.padding = "4px";
		if (boostObj.boostLevel > i){
		  	thisBoost.classList.add('w3-green');
		}else{
				thisBoost.classList.add('w3-red');
		}
		thisBoost.classList.add('w3-tiny');
		thisBoost.classList.add('w3-border');
		thisBoost.classList.add('w3-circle');
		thisBoost.classList.add('w3-round-xxlarge');
		thisElement.appendChild(thisBoost);
	}

}

function step(){
	obj_time.elapsed += TIMEOUT / 1000;
	obj_player.cash += calc_earnings();
	obj_player.earned += calc_earnings();
	//notify('You just earned ' + bigMoneyForm(calc_earnings() * 1000 / TIMEOUT )+ '!');
	checkAchievements();
	update_values();
	t = setTimeout( step, TIMEOUT);
}

/* EARNINGS PER STEP CALCULATIONS */
function calc_earnings(){
	var earnings = 0;
	earnings += calc_facility_earnings(obj_mines);
	earnings += calc_facility_earnings(obj_rigs);
	earnings += calc_facility_earnings(obj_refineries);
	/* ADD_MORE_FACILITIES */
	//earnings += obj_player.cash * interest_multiplier;
	return earnings;
}

function calc_facility_earnings(facilityObj){
	return (Math.pow(facilityObj.count, facilityObj.earningsExponent) ) * facilityObj.earnings * facilityObj.boost * efficiency.boost;
}

/* UPDATING VALUES ON THE PAGE ITSELF */
function update_values(){
	
	document.getElementById('showCash').innerHTML = bigMoneyForm(obj_player.cash);
	document.getElementById('showEarned').innerHTML = bigMoneyForm(obj_player.earned);
	document.getElementById('showElapsed').innerHTML = formattedTime(obj_time.elapsed);
	document.getElementById('allBoost').innerHTML = bigMoneyForm(efficiency.boost) + " x";
	
	/* MINES BOX */
	document.getElementById('showMines').innerHTML = obj_mines.count;
	document.getElementById('minesCost').innerHTML = bigMoneyForm(obj_mines.cost);
	document.getElementById('minesEarn').innerHTML = bigMoneyForm(calc_facility_earnings(obj_mines) / TIMEOUT * 1000);
	document.getElementById('minesBoost').innerHTML = bigMoneyForm(obj_mines.boost) + " x";

	if (obj_mines.cost <= obj_player.cash){
		document.getElementById('minesBtn').classList.remove('w3-red');
		document.getElementById('minesBtn').classList.add('w3-green');
	}else{
		document.getElementById('minesBtn').classList.remove('w3-green');
		document.getElementById('minesBtn').classList.add('w3-red');
	}
	
	/* RIGS BOX */
	document.getElementById('showRigs').innerHTML = obj_rigs.count;
	document.getElementById('rigsCost').innerHTML = bigMoneyForm(obj_rigs.cost);
	document.getElementById('rigsEarn').innerHTML = bigMoneyForm(calc_facility_earnings(obj_rigs) / TIMEOUT * 1000);
	document.getElementById('rigsBoost').innerHTML = bigMoneyForm(obj_rigs.boost) + " x";
	
	if (obj_rigs.cost <= obj_player.cash){
		document.getElementById('rigsBtn').classList.remove('w3-red');
		document.getElementById('rigsBtn').classList.add('w3-green');
	}else{
		document.getElementById('rigsBtn').classList.remove('w3-green');
		document.getElementById('rigsBtn').classList.add('w3-red');
	}
	
	/* REFINERY BOX */
	document.getElementById('showRefineries').innerHTML = obj_refineries.count;
	document.getElementById('refineriesCost').innerHTML = bigMoneyForm(obj_refineries.cost);
	document.getElementById('refineriesEarn').innerHTML = bigMoneyForm(calc_facility_earnings(obj_refineries) / TIMEOUT * 1000);
	document.getElementById('refineriesBoost').innerHTML = bigMoneyForm(obj_refineries.boost) + " x";
		
	if (obj_refineries.cost <= obj_player.cash){
		document.getElementById('refineriesBtn').classList.remove('w3-red');
		document.getElementById('refineriesBtn').classList.add('w3-green');
	}else{
		document.getElementById('refineriesBtn').classList.remove('w3-green');
		document.getElementById('refineriesBtn').classList.add('w3-red');
	}
	
	/* ADD_MORE_FACILITIES */
	
}

function duplicateElements(array, times) { 
	return array.reduce((res, current) => { return res.concat(Array(times).fill(current)); }, []); 
}

function bigMoneyForm(value){
	
	var exp = value.toExponential(3);
	var prefix = ""; //"£";
	var strExp = String (exp);
	var findE = strExp.indexOf('e');
	var sign = strExp.substr(findE + 1, 1);
	var coefficient = strExp.substr(0, findE - 1);
	var exponent = Number(sign + strExp.substr(findE + 2, 2) );	
	
	var maxExp = largeNumbers.length;
	if (exponent >= maxExp){
		// Err - too big!
		return false;
	}else if (exponent < 3){
		return Math.floor(value);
	}
	
	var suffix = largeNumbers[exponent];
	var subtract = (exponent % 3) + 1;
	var multiplier = subtract;
	var newStr = prefix + (coefficient * Math.pow(10, multiplier - 1) ).toFixed(2) + suffix;
	return newStr;
	
}

function formattedTime(time){
	for (var i = 0; i < timeDivides.length; i++){
		if (time < timeDivides[i]){
			if (i === 0){ divider = 1; } else { divider = (timeDivides[i-1] + 1); }
			timeStr = (time / divider ).toFixed(1) + ' ' + timeSuffixes[i];
			return timeStr;
		}
	}
}

/* element specific functions */
function buyFacility(facilityObj){
	
	if (obj_player.cash >= facilityObj.cost){
		
		obj_player.cash -= facilityObj.cost;
		facilityObj.count += 1;
		facilityObj.cost *= facilityObj.costMultiplier;
		
		checkAllBoost();	

		if (facilityObj === obj_mines){
			var boostElement = document.getElementById('minesBoost' + facilityObj.boostLevel);
			//starBurst('minesBtn');
			//starBurst('showElapsed');
		}
		if (facilityObj === obj_rigs){
			var boostElement = document.getElementById('rigsBoost' + facilityObj.boostLevel);
			//starBurst('rigsBtn');
		}
		if (facilityObj === obj_refineries){
			var boostElement = document.getElementById('refineriesBoost' + facilityObj.boostLevel);
			//starBurst('refineriesBtn');
		}
			
		if (facilityObj.count == facilityObj.boostLevels[facilityObj.boostLevel]){
			
			boostElement.classList.remove('w3-red');
			boostElement.classList.add('w3-green');
			
			facilityObj.boostLevel += 1;
			facilityObj.boost *= 1000;
		}
	}else{
		//notify('Not enough money!');
	}
}

function checkAllBoost(){
	var checkLevel = efficiency.boostLevels[efficiency.boostLevel];
	//console.log('M: ' + obj_mines.count + ', O: ' + obj_rigs.count + ', R: ' + obj_refineries.count);
	if (
		(obj_mines.count >= checkLevel) &&
		(obj_rigs.count >= checkLevel) &&
		(obj_refineries.count >= checkLevel)
	){
		var boostElement = document.getElementById('allBoost' + efficiency.boostLevel);
		boostElement.classList.remove('w3-red');
		boostElement.classList.add('w3-green');
		efficiency.boostLevel += 1;
		efficiency.boost *= 1000;
	}
}

function checkAchievements(){
	for (var i = 0; i < achievements.length; i++){
		if ( (achievements[i].achieved === 0) || (achievements[i].hasOwnProperty('achieved') === false) ){
			var checkVar = eval(achievements[i].check);
			var compareVar = achievements[i].value;
			if (checkVar >= compareVar){
				
				achievements[i].achieved = obj_player.elapsed;
				
				var icon = document.getElementById('achievementIcon' + i);
				icon.classList.remove('w3-red');
				icon.classList.add('w3-green');
				icon.innerHTML += ' &#10004;';
				
				var iconTooltip = document.getElementById('achievementTooltip' + i);			
				iconTooltip.innerHTML += ' <br> <em>Achieved in: ' + formattedTime(obj_time.elapsed) + '</em>';
				//console.log('Achieved ' + achievements[i].name + ' at ' + obj_time.elapsed);
				
			}
		}
	}
	
}


document.addEventListener('visibilitychange', function() {
	focus = !focus;
	if (focus === false){
		blurTime = Date.now();
	}else{
		var diff = Date.now () - blurTime;
		var cycles = diff / TIMEOUT;
		var awayEarn = calc_earnings() * cycles;
		obj_time.elapsed += cycles * (TIMEOUT / 1000);
		obj_player.cash += awayEarn;
		obj_player.earned += awayEarn;
		var earnStr = bigMoneyForm(awayEarn);
		update_values();
	}
});

window.addEventListener("beforeunload", function (e) { 
	var confirmationMessage = 'Warning! Leaving this page will lose any unsaved idle mining progress! \n Remember to use the SAVE GAME DATA button to store your progress!'; 
	(e || window.event).returnValue = confirmationMessage; //Gecko + IE 
	return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc. 
});

function resetGameProgress(){

	if (window.confirm("This will reset your facility upgrades but you will keep your efficiency (ALL) boost.\n \nWould you like to reset?") ) {
		init(true);
	}
}

function saveData(){

	var saved_time = localStorage.getItem("idle_miner_time");
	if (saved_time !== null){
		var decodedTime = JSON.parse(saved_time);
		var saved_elapsed = decodedTime.elapsed;
		if (window.confirm("Saved data found - time elapsed: " + formattedTime(saved_elapsed) + "\n \nWould you like to overwrite this data?") ) {			
			encodeSave();
		}
	}else{
		encodeSave();
	}
}

function encodeSave(){
	
	var encodedAchieve = JSON.stringify(achievements);
	localStorage.setItem("idle_miner_achievements", encodedAchieve);
	var encodedMines = JSON.stringify(obj_mines);
	localStorage.setItem("idle_miner_mines", encodedMines);
	var encodedRigs = JSON.stringify(obj_rigs);
	localStorage.setItem("idle_miner_rigs", encodedRigs);
	var encodedRefineries = JSON.stringify(obj_refineries);
	localStorage.setItem("idle_miner_refineries", encodedRefineries);
	var encodedPlayer = JSON.stringify(obj_player);
	localStorage.setItem("idle_miner_player", encodedPlayer);
	var encodedTime = JSON.stringify(obj_time);
	localStorage.setItem("idle_miner_time", encodedTime);
	var encodedEfficiency = JSON.stringify(efficiency);
	localStorage.setItem("idle_miner_efficiency", encodedEfficiency);
	alert('Game saved!');
}

function loadData(){
	
	var saved_time = localStorage.getItem("idle_miner_time");
	if (saved_time === null){
		alert("No saved data found!");
	}else{
		var decodedTime = JSON.parse(saved_time);
		var saved_elapsed = decodedTime.elapsed;
		if (window.confirm("Load data found - time elapsed: " + formattedTime(saved_elapsed) + "\n \n Would you like to load this data?") ) {
			var encodedAchieve = localStorage.getItem("idle_miner_achievements");
			achievements = JSON.parse(encodedAchieve);
			var encodedMines = localStorage.getItem("idle_miner_mines");
			obj_mines = JSON.parse(encodedMines);
			var encodedRigs = localStorage.getItem("idle_miner_rigs");
			obj_rigs = JSON.parse(encodedRigs);
			var encodedRefineries = localStorage.getItem("idle_miner_refineries");
			obj_refineries = JSON.parse(encodedRefineries);
			var encodedPlayer = localStorage.getItem("idle_miner_player");
			obj_player = JSON.parse(encodedPlayer);
			var encodedTime = localStorage.getItem("idle_miner_time");
			obj_time = JSON.parse(encodedTime);
			var encodedEfficiency = localStorage.getItem("idle_miner_efficiency");
			efficiency = JSON.parse(encodedEfficiency);
			generateLevelIcons();
			checkAllBoost();
			alert("Game loaded!");
		}
	}
}