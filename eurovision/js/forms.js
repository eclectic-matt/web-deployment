//DEBUG
var preventDuplicates = false;

//DEFAULT COLOUR
const defaultThemeColour = 'w3-deep-purple';

/**
 * Remove the disabled status from all options.
 */
function removeDisabled(){
	let selects = document.getElementsByTagName('select');
	Array.from(selects).forEach( (el) => {
		options = el.options;
		for(let i = 0; i < options.length; i++){
			options[i].disabled = false;
		}
	});
}

function removeSelected(className, id, countryName, scoreValue){
	let selects = document.getElementsByClassName(className);
	Array.from(selects).forEach( (el) => {
		options = el.options;
		for(let i = 0; i < options.length; i++){
			if(options[i].innerHTML.includes(countryName)){
				options[i].innerHTML = options[i].innerHTML.replace(countryName,'').trim();
			}
		}
	});

}

function disableOption(className, id, countryName, scoreValue){
	let selects = document.getElementsByClassName(className);
	Array.from(selects).forEach( (el) => {
		//SKIP THIS COUNTRY'S SELECTS
		if (el.id !== id){
			options = el.options;
			for(let i = 0; i < options.length; i++){
				let optVal = options[i].value;
				//IF THIS OPTION MATCHES
				if (optVal == scoreValue){
					options[i].disabled = true;
				}
			}
		}
	});
}

function updateSelects(className, id, countryName, scoreValue){
	let selects = document.getElementsByClassName(className);
	Array.from(selects).forEach( (el) => {
		//SKIP THIS COUNTRY'S SELECTS
		options = el.options;
		for(let i = 0; i < options.length; i++){
			let optVal = options[i].value;
			//IF THIS OPTION MATCHES
			if (optVal == scoreValue){
				//IF ANOTHER COUNTRY ALREADY ADDED
				if(options[i].innerHTML !== options[i].value){
					//CONCAT
					options[i].innerHTML = options[i].innerHTML + ' ' + countryName;
				}else{
					//SET AS COUNTRY
					options[i].innerHTML = options[i].value + ' - ' + countryName;
				}
			}
		}
	});
}


function changePoints(ev){
	let select = ev.target;

	var countryId = select.id.replace('select-points-','');
	var el = document.getElementById(countryId);
	el.setAttribute('points',select.value);

	saveDataItem(countryId + '-points', select.value);

	//REMOVE THIS COUNTRY FROM *OTHER* POINTS VALUES
	removeSelected('pointsSelect', select.id, select.name, select.value);

	//IF THE OPTION TO PREVENT DUPLICATES IS SELECTED
	if(preventDuplicates){
		//DISABLE THIS VALUE ON ALL OTHER SELECTS
		disableOption('pointsSelect', select.id, select.name, select.value);
	}
	
	//THEN UPDATE ALL SELECTS TO SHOW THIS COUNTRY ATTACHED TO THIS VALUE (CONCAT IF DUPLICATES ALLOWED)
	updateSelects('pointsSelect',  select.id, select.name, select.value);

	//UPDATE SORT ORDER AND ORDER BOXES NEXT TO COUNTRIES
	var direction = document.getElementById('sortDirection').value;
	var key = document.getElementById('sortKey').value;
	sortElements('acts',key,direction);
	window.location.href = '#' + countryId;
	updateOrders();

	updateScoresTable();
}

function changePredict(ev){
	let select = ev.target;

	var countryId = select.id.replace('select-predict-','');
	var el = document.getElementById(countryId);
	el.setAttribute('predict',select.value);

	saveDataItem(countryId + '-predict', select.value);

	//REMOVE THIS COUNTRY FROM *OTHER* POINTS VALUES
	removeSelected('predictSelect', select.id, select.name, select.value);

	//IF THE OPTION TO PREVENT DUPLICATES IS SELECTED
	if(preventDuplicates){
		//DISABLE THIS VALUE ON ALL OTHER SELECTS
		disableOption('predictSelect', select.id, select.name, select.value);
	}
	
	//THEN UPDATE ALL SELECTS TO SHOW THIS COUNTRY ATTACHED TO THIS VALUE (CONCAT IF DUPLICATES ALLOWED)
	updateSelects('predictSelect',  select.id, select.name, select.value);

	//UPDATE SORT ORDER AND ORDER BOXES NEXT TO COUNTRIES
	var direction = document.getElementById('sortDirection').value;
	var key = document.getElementById('sortKey').value;
	sortElements('acts',key,direction);
	window.location.href = '#' + countryId;
	updateOrders();

	updateScoresTable();
}

function changeRanking(ev){
	let select = ev.target;
	var countryId = select.id.replace('select-rank-','');

	saveDataItem(countryId + '-rank', select.value);

	var el = document.getElementById(countryId);
	el.setAttribute('rank',select.value);

	//REMOVE THIS COUNTRY FROM *OTHER* POINTS VALUES
	removeSelected('rankSelect', select.id, select.name, select.value);

	//IF THE OPTION TO PREVENT DUPLICATES IS SELECTED
	if(preventDuplicates){
		//DISABLE THIS VALUE ON ALL OTHER SELECTS
		disableOption('rankSelect', select.id, select.name, select.value);
	}
	
	//THEN UPDATE ALL SELECTS TO SHOW THIS COUNTRY ATTACHED TO THIS VALUE (CONCAT IF DUPLICATES ALLOWED)
	updateSelects('rankSelect',  select.id, select.name, select.value);
	
	//UPDATE SORT ORDER AND ORDER BOXES NEXT TO COUNTRIES
	var direction = document.getElementById('sortDirection').value;
	var key = document.getElementById('sortKey').value;
	sortElements('acts',key,direction);
	window.location.href = '#' + countryId;
	updateOrders();

	updateScoresTable();
}


function changeNotes(ev){
	let textarea = ev.target;
	var countryId = textarea.id.replace('notes-','');

	saveDataItem(countryId + '-notes', textarea.value);
}

function updateOrders(){
	var key = document.getElementById('sortKey').value;
	let orderBoxes = document.getElementsByClassName('orderBox');
	Array.from(orderBoxes).forEach( (el) => {
		let countryId = el.id.replace('order-','');
		let country = document.getElementById(countryId);
		let order = country.getAttribute(key);
		el.innerHTML = '<span class="w3-small">' + key + ':</span> ' + order;
	}, key);
}

function updateScoresTable(){
	var scores = {};
	scores.rank = [];
	scores.predict = [];
	scores.points = [];

	let countries = document.getElementsByClassName('country');

	Array.from(countries).forEach( (el) => {
		let country = el.id;
		let rank = el.getAttribute('rank');
		let predict = el.getAttribute('predict');
		let points = el.getAttribute('points');
		//GET RANK
		if(rank > 0){
			if(!scores.rank[rank]){
				scores.rank[rank] = [];
			}
			scores.rank[rank].push(country);
		}
		//GET PREDICT
		if(predict > 0){
			if(!scores.predict[predict]){
				scores.predict[predict] = [];
			}
			scores.predict[predict].push(country);
		}
		//GET POINTS
		if(points > 0){
			if(!scores.points[points]){
				scores.points[points] = [];
			}
			scores.points[points].push(country);
		}
	}, scores);
	
	var scoresTableDiv = document.getElementById('scoresTable');
	scoresTableDiv.innerHTML = '';

	var table = document.createElement('table');
	table.className = 'w3-table-all';

	var thead = document.createElement('tr');

	th = document.createElement('th');
	th.innerHTML = 'Value';
	thead.appendChild(th);

	th = document.createElement('th');
	th.innerHTML = 'Rank';
	thead.appendChild(th);

	th = document.createElement('th');
	th.innerHTML = 'Predict';
	thead.appendChild(th);

	th = document.createElement('th');
	th.innerHTML = 'Points';
	thead.appendChild(th);

	table.appendChild(thead);

	//CREATE 26 ROWS
	[...Array(26).keys()].forEach((val) => { 
		
		let rowId = (val + 1);
		tr = document.createElement('tr');
		tr.classList.add('w3-hover-green');

		td = document.createElement('td');
		td.innerHTML = rowId;
		tr.appendChild(td);
		
		//RANK
		td = document.createElement('td');
		td.classList.add('w3-small');
		td.innerHTML = (scores.rank[rowId]) ? scores.rank[rowId].join(',').replace('-',' ').toProperCase() : '';
		tr.appendChild(td);

		//PREDICT
		td = document.createElement('td');
		td.classList.add('w3-small');
		td.innerHTML = (scores.predict[rowId]) ? scores.predict[rowId].join(',').replace('-',' ').toProperCase() : '';
		tr.appendChild(td);

		//POINTS
		td = document.createElement('td');
		td.classList.add('w3-small');
		td.innerHTML = (scores.points[rowId]) ? scores.points[rowId].join(',').replace('-',' ').toProperCase() : '';
		tr.appendChild(td);

		table.appendChild(tr);

	}, scores, table);

	scoresTableDiv.appendChild(table);
}

//UTILITY TO GET PROPER CASE COUNTRY NAMES
String.prototype.toProperCase = function () {
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function countryNameToId(name){
	return name.replace(' ', '-').toLowerCase();
}

function countryIdToName(id){
	return id.replace('-',' ').toProperCase();
}

function updateTheme(theme){

	//console.log('theme change',theme);

	//UPDATE BUTTONS
	let buttons = document.getElementsByClassName('countryButtons');
	Array.from(buttons).forEach( (el) => {
		
		country = el.getAttribute('name');
		data = getActObjectFromCountry(country);
		bgColour = data.bgColour;
		className = 'w3-' + bgColour;
		switch(theme){
			case 'plain':
				//REMOVE CUSTOM COLOURS 
				el.classList.remove(className);
				//SET PLAIN COLOUR
				el.classList.add(defaultThemeColour);
			break;
			case 'default':
				//REMOVE PLAIN COLOUR
				el.classList.remove(defaultThemeColour);
				//SET CUSTOM COLOUR
				el.classList.add(className);
			break;
		}
	}, theme);

	//UPDATE INNER DIVS
	let countryDivs = document.getElementsByClassName('countryDivs');
	Array.from(countryDivs).forEach( (el) => {
		
		country = el.getAttribute('name');
		data = getActObjectFromCountry(country);
		bgColour = data.bgColour;
		className = 'w3-' + bgColour;
		switch(theme){
			case 'plain':
				//REMOVE CUSTOM COLOURS 
				el.classList.remove(className);
				//SET defaultThemeColour
				el.classList.add(defaultThemeColour);
			break;
			case 'default':
				//REMOVE defaultThemeColour
				el.classList.remove(defaultThemeColour);
				//SET CUSTOM COLOUR
				el.classList.add(className);
			break;
		}
	}, theme);

}


function getActObjectFromCountry(thisCountry){
	return json.acts.filter(function(acts){
		return acts.country === thisCountry;
	}, thisCountry);
}


function updateSettings(ev){

	//SAVE SETTINGS
	saveDataItem('settings-' + ev.target.name, ev.target.value);

	switch(ev.target.name){
		case 'preventDuplicates':
			preventDuplicates = ev.target.checked;
			if(!preventDuplicates){
				removeDisabled();
			}
		break;
		case 'eventSelect':
			eventName = ev.target.value;
			//CLEAR DIV AND REGENERATE
			generateActsList(json, true);
			updateOrders();
			loadData();
		break;
		case 'sortKey':
			var key = ev.target.value;
			//GET DIRECTION
			var direction = document.getElementById('sortDirection').value;
			sortElements('acts',key,direction);
			updateOrders();
		break;
		case 'sortDirection':
			var direction = ev.target.value;
			//GET KEY
			var key = document.getElementById('sortKey').value;
			sortElements('acts',key,direction);
			updateOrders();
		break;

		case 'colourTheme':
			var theme = ev.target.value;
			settings.colourTheme = theme;
			updateTheme(theme);
			updateOrders();
		break;
	}
}

//NOT USED?
function fillOptions(){
	var ranks = document.querySelector('.rankSelect');
	Array.from(ranks).forEach( (el) => {

	});
}
