function saveDataItem(key, val){
	localStorage.setItem(key, val);
}

function loadData(){

	//-=-=-=-=-=-=-=
	//LOAD SETTINGS
	//-=-=-=-=-=-=-=
	//GET SETTING
	loadSetting('eventSelect');
	loadSetting('sortKey');
	loadSetting('sortDirection');
	loadSetting('preventDuplicates');
	loadSetting('colourTheme');

	//-=-=-=-=-=-=-=
	//LOAD DATA
	//-=-=-=-=-=-=-=
	keys = ['rank', 'predict', 'points', 'notes'];
	countries = json.acts;
	countries.forEach( (country) => {
		let countryName = country.country;
		//console.log('countryName', countryName);
		countryId = countryNameToId(countryName);
		keys.forEach( (key) => {
			dataName = countryId + '-' + key;
			if( (localStorage.getItem(dataName)) && (localStorage.getItem(dataName) != '') ){
				//console.log('Load Data',dataName,localStorage.getItem(dataName));
				loadDataItem(countryId, key, localStorage.getItem(dataName));
			}
		}, countryId);
	}, keys);

	//FINALLY, UPDATE ORDERS AND SCORES TABLE
	updateOrders();
	updateScoresTable();
}

function loadSetting(name){
	var settingData = localStorage.getItem('settings-' + name);
	if( (settingData) && (settingData != '')){
		var settingsEl = document.getElementById(name);
		//CHECKBOX ON
		if(settingData === 'true'){
			//settingsEl.value = true;
			settingsEl.checked = true;
		//CHECKBOX OFF
		}else if (settingData === 'false'){
			//settingsEl.value = false;
			settingsEl.checked = false;
		//SELECT
		}else{
			settingsEl.value = settingData;
		}

		//DO NOT TRIGGER EVENT DISPATCH ON eventSelect
		if(name !== 'eventSelect'){
			//FIRE EVENT TO TRIGGER UPDATE
			var settingsEvent = document.createEvent("Event");
			settingsEvent.initEvent("change", false, true); 
			settingsEl.dispatchEvent(settingsEvent);
		}
	}

}

function fillOptions(){
	var ranks = document.querySelector('.rankSelect');
	Array.from(ranks).forEach( (el) => {

	});


}

function clearSavedData(){
	var confirm = window.confirm('This will clear all saved data - are you sure?');
	if(confirm === true){
		localStorage.clear();
		window.location.reload();
	}
}

function loadDataItem(countryId, type, value){

	if(type !== 'notes'){
		//UPDATE SELECTS
		let element = document.getElementById('select-' + type + '-' + countryId);
		if(element){
			element.value = value;
			//element.innerHTML += countryIdToName(countryId);
			document.getElementById('option-' + type + '-' + countryId).innerHTML += ' ' + countryIdToName(countryId);
		}
		let country = document.getElementById(countryId);
		if(country){
			country.setAttribute(type,value);
		}
	}else{
		let element = document.getElementById('notes-' + countryId);
		if(element){
			element.innerHTML = value;
		}
	}
}

