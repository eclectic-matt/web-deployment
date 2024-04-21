//GOOGLE SHEET TO GENERATE acts.json
//https://docs.google.com/spreadsheets/d/1lme7mH1AtvpYvDCoz1h_Ae7fdv2ijn_X67Z2-1opPB8/edit#gid=0

//2023
//https://eurovision.tv/event/liverpool-2023/participants
//https://en.wikipedia.org/wiki/Eurovision_Song_Contest_2023#Format

//2024
//https://eurovision.tv/event/malmo-2024/first-semi-final
//https://en.wikipedia.org/wiki/Eurovision_Song_Contest_2024

var json;
//DEBUG - LIMIT TO ONE EVENT
var eventName = 'Grand Final';

var settings = {};
settings.colourTheme = 'default';

//LAST YEAR
//var dataFile = 'data/2023_acts.json';
var dataFile = 'data/2024_acts.json';

function init(){
	//console.log('init');
	initModal();
	json = asyncAPIcall(dataFile, showActs, showError);
}
function asyncAPIcall(url, apiSuccess, apiFailure){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = () => { 
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
			apiSuccess(url, xmlHttp.responseText);
		}
		if(xmlHttp.readyState == 4 && xmlHttp.status !== 200){
			apiFailure(url, xmlHttp);
		}
	}
	xmlHttp.open('GET', url, true);
	xmlHttp.send(null);
}

function showActs(url, response){
	//console.log(url, response);
	json = JSON.parse(response);

	generateActsList(json);

	updateOrders();

	loadData();

	//sortElements('acts','billing','DESC');
}

function generateActsList(json, clearDiv=false){

	var actsDiv = document.getElementById('acts');
	
	if(clearDiv){
		actsDiv.innerHTML = '';
	}

	for(let act in json.acts){
		//console.log(act);
		act = json.acts[act];

		var countryWrapper = document.createElement('div');

		//ONLY ADD IF MATCHING THIS EVENT?
		switch(eventName){
			case 'Semi Final #1':
				//PASSED
				if(act.semiFinal.eventNumber !== 1){
					//NOT IN THIS SEMI-FINAL, SKIP
					continue;
				}else{
					//SET BILLING ATTRIBUTE
					countryWrapper.setAttribute('billing',act.semiFinal.billingNumber);
				}
			break;
			case 'Semi Final #2':
				if(act.semiFinal.eventNumber !== 2){
					//NOT IN THIS SEMI-FINAL, SKIP
					continue;
				}else{
					//SET BILLING ATTRIBUTE
					countryWrapper.setAttribute('billing',act.semiFinal.billingNumber);
				}
			break;
			case 'Grand Final':
				if(act.final.billingNumber === 0){
					//NOT IN THE-FINAL, SKIP
					continue;
				}else{
					//SET BILLING ATTRIBUTE
					countryWrapper.setAttribute('billing',act.final.billingNumber);
				}
			break;
		}

		let name = act.country;
		let idname = act.country.replace(' ', '-').toLowerCase();

		countryWrapper.id = idname;
		countryWrapper.className = 'country';
		countryWrapper.setAttribute('name',name);
		countryWrapper.setAttribute('points',0);
		countryWrapper.setAttribute('rank',0);
		countryWrapper.setAttribute('predict',0);
		countryWrapper.setAttribute('score',0);

		//GET FLAG + COUNTRY NAME
		var flagSpan = document.createElement('span');
		flagSpan.className = 'fi fi-' + act.countryFlagCode;
		flagSpan.innerHTML = '';
		var countrySpan = document.createElement('span');
		countrySpan.innerHTML = '&nbsp;&nbsp;' + name;

		//MAKE ACCORDION BUTTON
		var countryButton = document.createElement('button');
		countryButton.className = 'countryButtons w3-btn-block w3-border w3-xlarge w3-margin-4';
		if(settings.colourTheme === 'default'){
			if(act.bgColor !== undefined){
				countryButton.className = countryButton.className + ' w3-' + act.bgColor;
			}
		}else{
			countryButton.className = countryButton.className + ' w3-black';
		}
		countryButton.name = name;
		
		countryButton.onclick = (ev, countryButton) => {
			//console.log('button click', ev, name);
			showHideCountries(idname + '-inner');
		}
		//countryButton.append(flagSpan);
		//countryButton.append(countrySpan);
		var key = document.getElementById('sortKey').value;
		switch(key){
			case 'billing':
				order = countryWrapper.getAttribute('billing');
			break;
			case 'rank':
				order = countryWrapper.getAttribute('rank');
			break;
			case 'predict':
				order = countryWrapper.getAttribute('predict');
			break;
			case 'points':
				order = countryWrapper.getAttribute('points');
			break;
		}

		//order = order.padStart(3,' ');
		//order = order.padEnd(5,' ');

		//countryButton.innerHTML = '<span class="w3-border w3-padding-small orderBox" id="order-' + idname + '">' + order + '</span>&nbsp;&nbsp;<span class="fi fi-' + act.countryFlagCode + '"></span>&nbsp;&nbsp;' + name;
		
		/*countryButton.innerHTML = '<div class="w3-row">';
		countryButton.innerHTML += '	<div class="w3-col s2">';
		countryButton.innerHTML += '		<span class="w3-border w3-padding-small orderBox" id="order-' + idname + '">' + order + '</span>';
		countryButton.innerHTML += '	</div>';
		countryButton.innerHTML += '	<div class="w3-col s2">';
		countryButton.innerHTML += '		<span class="fi fi-' + act.countryFlagCode + '"></span>';
		countryButton.innerHTML += '	</div>';
		countryButton.innerHTML += '	<div class="w3-col s8">' + name + '</div>';
		countryButton.innerHTML += '</div>';*/
		
		countryButton.innerHTML = `
			<div class="w3-row">
				<div class="w3-col s3">
					<span class="w3-border w3-padding-small orderBox" id="order-` + idname + `">` + order + `</span>
				</div>
				<div class="w3-col s3">
					<span class="fi fi-` + act.countryFlagCode + `"></span>
				</div>
			<div class="w3-col s6">` + name + `</div>
		</div>`;

		//actsDiv.appendChild(countryButton);

		//MAKE DIV HEAD
		var head = document.createElement('h2');
		head.appendChild(flagSpan);
		head.appendChild(countrySpan);
		var artist = document.createElement('h3');
		artist.innerHTML = 'Artist: ' + act.artist;
		var songTitle = document.createElement('h4');
		songTitle.className = 'w3-padding-8';
		songTitle.innerHTML = 'Song: ' + act.song;

		//NEW - SONG VIDEO IFRAME
		var songVid = document.createElement('iframe');
		if(act.youtubeVideoId){
			songVid.width = 560;
			songVid.height = 315;
			songVid.src = 'https://www.youtube.com/embed/' + act.youtubeVideoId;
			songVid.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
			songVid.setAttribute('frameBorder', '0');
			songVid.setAttribute('allowFullScreen', true);
		}


		//YOUR SCORES
		// RANKING = 1 to 26
		// PREDICTION = 1 to 26
		// POINTS = 1,2,3,4,5,6,7,8,10,12

		var scoresInfo = document.createElement('h5');
		scoresInfo.innerHTML = 'Your Scores';

		//DEFINE SCORES ROW
		var scoresRow = document.createElement('div');
		scoresRow.className = 'w3-row-padding w3-padding-8';
		
		//--RANKING
		var rankingCol = document.createElement('div');
		rankingCol.className = 'w3-col s4';

		var rankingLabel = document.createElement('label');
		rankingLabel.innerHTML = 'Ranking: ';
		rankingLabel.title = 'Your rank - scored from 26th (worst) up to 1st place (best)';
		rankingLabel.for = 'select-rank-' + idname;

		var ranking = document.createElement('select');
		ranking.id = 'select-rank-' + idname;
		ranking.className = 'w3-select rankSelect';
		ranking.name = name;
		
		//DEFINE DEFAULT OPTION
		let defaultRankOption = document.createElement('option');
		defaultRankOption.selected = true;
		defaultRankOption.disabled = true;
		defaultRankOption.innerHTML = '--???--';
		
		//ADD DEFAULT OPTION
		ranking.appendChild(defaultRankOption);

		//ADD 26 OTHER OPTIONS
		[...Array(26).keys()].forEach((val) => { 
			let option = document.createElement('option');
			option.id = 'option-rank-' + (val + 1) + '-' + idname;
			option.value = (val + 1);
			option.innerHTML = (val + 1);
			ranking.appendChild(option);
		});
		//ADD EVENT LISTENER AFTER ADDING ELEMENTS
		ranking.addEventListener('change', changeRanking);

		rankingCol.appendChild(rankingLabel);
		rankingCol.appendChild(ranking);
		scoresRow.appendChild(rankingCol);

		//--PREDICTION
		var predictCol = document.createElement('div');
		predictCol.className = 'w3-col s4';

		var predictLabel = document.createElement('label');
		predictLabel.innerHTML = 'Predict: ';
		predictLabel.title = 'The position on the table you PREDICT this country will get';
		predictLabel.for = 'select-predict-' + idname;

		var predict = document.createElement('select');
		predict.id = 'select-predict-' + idname;
		predict.className = 'w3-select predictSelect';
		predict.name = name;

		//DEFINE DEFAULT OPTION
		let defaultPredictOption = document.createElement('option');
		defaultPredictOption.selected = true;
		defaultPredictOption.disabled = true;
		defaultPredictOption.innerHTML = '--???--';
		
		//ADD DEFAULT OPTION
		predict.appendChild(defaultPredictOption);

		//ADD 26 OTHER OPTIONS
		[...Array(26).keys()].forEach((val) => { 
			let option = document.createElement('option');
			option.id = 'option-predict-' + (val + 1) + '-' + idname;
			option.value = (val + 1);
			option.innerHTML = (val + 1);
			predict.appendChild(option);
		});
		//ADD EVENT LISTENER AFTER ADDING ELEMENTS
		predict.addEventListener('change', changePredict);

		predictCol.appendChild(predictLabel);
		predictCol.appendChild(predict);
		scoresRow.appendChild(predictCol);

		//--POINTS
		var pointsCol = document.createElement('div');
		pointsCol.className = 'w3-col s4';

		var pointsLabel = document.createElement('label');
		pointsLabel.innerHTML = 'Points: ';
		pointsLabel.title = 'The number of points you would award (Eurovision-style!)';
		pointsLabel.for = 'select-points-' + idname;

		var points = document.createElement('select');
		points.className = 'w3-select pointsSelect';
		points.id = 'select-points-' + idname;
		points.name = name;

		//DEFINE DEFAULT OPTION
		let defaultPointsOption = document.createElement('option');
		defaultPointsOption.selected = true;
		defaultPointsOption.disabled = true;
		defaultPointsOption.innerHTML = '--???--';

		//ADD DEFAULT OPTION
		points.appendChild(defaultPointsOption);

		//ADD 10 OTHER OPTIONS
		[...Array(10).keys()].forEach((val) => {

			let option = document.createElement('option');

			//BACKWARDS (CODED)
			//0=12,1=10,2=8,...9=1

			//FORWARDS (COMMENTED)
			//0=1,1=2,...8=10,9=12
			
			//if(val < 8){
			if(val > 1){
				let thisVal = 10 - val;
				option.id = 'option-points-' + (val + 1) + '-' + idname;
				option.value = thisVal;
				option.innerHTML = thisVal;
				//DISPLAY FORWARDS (0=1,1=2 etc)
				//option.id = 'option-points-' + (val + 1) + '-' + idname;
				//option.value = (val + 1);
				//option.innerHTML = (val + 1);
			}else{
				//NO "8" POINTS, SO GIVE 10
				if(val === 1){
					//8 = 10
					option.id = 'option-points-10';
					option.value = 10;
					option.innerHTML = 10;
				}else{
					//AND FOR 9, GIVE 12
					option.id = 'option-points-12';
					option.value = 12;
					option.innerHTML = 12;
				}
			}
			points.appendChild(option);
		});
		//ADD 0 OPTION
		let option = document.createElement('option');
		option.id = 'option-points-0-' + idname;
		option.value = 0;
		option.innerHTML = 0;
		points.appendChild(option);

		//ADD EVENT LISTENER AFTER ADDING ELEMENTS
		points.addEventListener('change', changePoints);
		pointsCol.appendChild(pointsLabel);
		pointsCol.appendChild(points);
		scoresRow.appendChild(pointsCol);

		var notes = document.createElement('textarea');
		notes.placeholder = 'Your thoughts on ' + name + ' here...';
		notes.cols = 30;
		notes.rows = 3;
		notes.id = 'notes-' + idname;
		notes.addEventListener('blur', changeNotes);

		//MAKE DATA TABLE
		var dataTable = document.createElement('table');
		dataTable.className = 'w3-table w3-center';

		//LANGUAGE
		var row =  document.createElement('tr');
		var th =  document.createElement('th');
		var td =  document.createElement('td');
		th.innerHTML = 'Language';
		td.innerHTML = act.language;
		row.appendChild(th);
		row.appendChild(td);
		dataTable.appendChild(row);

		//SEMI FINAL EVENT
		var row =  document.createElement('tr');
		var th =  document.createElement('th');
		var td =  document.createElement('td');
		th.innerHTML = 'Semi Final #';
		td.innerHTML = (act.semiFinal.eventNumber === 0) ? 'N/A' : act.semiFinal.eventNumber;
		row.appendChild(th);
		row.appendChild(td);
		dataTable.appendChild(row);

		//SEMI FINAL BILLING
		var row =  document.createElement('tr');
		var th =  document.createElement('th');
		var td =  document.createElement('td');
		th.innerHTML = 'Semi Final Running Order';
		td.innerHTML = (act.semiFinal.billingNumber === 0) ? 'N/A' : act.semiFinal.billingNumber;
		row.appendChild(th);
		row.appendChild(td);
		dataTable.appendChild(row);

		//MAKE COUNTRY DIV
		var countryDiv = document.createElement('div');
		countryDiv.id = idname + '-inner';
		countryDiv.name = name;
		var animateClass = 'w3-animate-zoom';
		countryDiv.className = 'w3-hide w3-card w3-center countryDivs'; // + animateClass;
		if(act.bgColor !== undefined){
			countryDiv.className = countryDiv.className + ' w3-' + act.bgColor;
		}

		//ADD TO COUNTRY DIV
		countryDiv.appendChild(head);
		countryDiv.appendChild(artist);
		countryDiv.appendChild(songTitle);
		countryDiv.appendChild(songVid);
		countryDiv.appendChild(scoresInfo);
		countryDiv.appendChild(scoresRow);
		countryDiv.appendChild(notes);
		countryDiv.appendChild(dataTable);

		//ADD COUNTRY DIV TO ACTS
		//actsDiv.appendChild(countryDiv);

		//ADD ALL TOGETHER
		countryWrapper.appendChild(countryButton);
		countryWrapper.appendChild(countryDiv);

		actsDiv.appendChild(countryWrapper);
	}

	//ALL ACTS ADDED - APPLY SORT (AFTER CHANGING EVENTS)
	var direction = document.getElementById('sortDirection').value;
	var key = document.getElementById('sortKey').value;
	sortElements('acts',key,direction);
}




function showHideCountries(name){
	
	//console.log('showing',name);
	//HIDE ALL COUNTRIES
	hideOtherCountries();

	//THEN JUST SHOW THIS COUNTRY
	var child = document.getElementById(name);
	child.classList.remove('w3-hide');
	//IF W3-HIDE IS FOUND
	//if (child.className.indexOf('w3-hide') !== -1) {
		//REMOVE W3-HIDE FOR THIS COUNTRY
		//child.className = child.className.replace('w3-hide', '');
	//}
}

function hideOtherCountries(){
	//FOREACH COUNTRY
	var countries = document.getElementsByClassName('countryDivs');
	Array.from(countries).forEach( (el) => {
		//HIDE THIS ELEMENT
		hideCountry(el);
	});
}

function hideCountry(div){
	//IF w3-hide IS NOT FOUND
	if(div.className.indexOf('w3-hide') == -1){
		//ADD w3-hide
		div.className = div.className + ' w3-hide';
	}
}

function showError(url, status){
	console.log(url, response);
}

//TO DO
//UPDATE acts.json WITH RUNNING ORDER FOR FINAL

//SORTING
// - view = change sort
// sort by rank,predict,scores,running order

//SCORES summary

//SAVE / LOAD FROM COOKIE/LOCALSTORAGE

//POST RESULTS TO ME FOR DISPLAY