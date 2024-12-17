class RoundData {
	name = "round";
	questionCount = 10;
	questions = [];
	canvases = [];
}
class TeamCanvases {
	team = "team_name";
	data = [];
}
class Canvas {
	round = 1;
	question = 1;
	data = {};
}

//log the path requested
console.log('location.pathname=',location.pathname,'location.search=',location.search);
let searchPairs = location.search.substr(1).split('&');
console.log(searchPairs);

//THE CANVAS HTML ELEMENT
var cnvEl = undefined;
//INITIALIZE THE CURRENT ROUND'S RESPONSES
var currentRoundData = [];
//DEFAULT NUMBER OF QUESTIONS PER ROUND
var questionsThisRound = 10;
//THE CURRENT QUESTION NUMBER
var currentQuestionNumber = 1;

//STORED CANVAS DATA (ARRAY OF CANVASES FROM 1 - 10, ONE PER QUESTION)
var cnvData = Array.from(questionsThisRound).fill(undefined);

//SIGNATURE PAD OBJECT
var signaturePad = undefined;
//SCALING RATIO FOR CANVAS ELEMENTS (BASED ON window.devicePixelRatio)
var ratio = 1;

//LITTLE HELPER FUNCTION TO REMAP getElementById SIMILAR TO JQUERY
const $ = (id) => document.getElementById(id);

//TRIGGERED BY WINDOW RESIZE EVENTS
const resizeCanvas = () => { 
	const data = signaturePad.toData();
	cnvEl.width = window.innerWidth;
	//HEIGHT REDUCED BY 50px FOR THE QUESTION BUTTONS ROW
	cnvEl.height = window.innerHeight - 50;
	ratio =  Math.max(window.devicePixelRatio || 1, 1);
	cnvEl.width = cnvEl.offsetWidth * ratio;
	cnvEl.height = cnvEl.offsetHeight * ratio;
	cnvEl.getContext("2d").scale(ratio, ratio);
	signaturePad.clear(); // otherwise isEmpty() might return incorrect value
	//NOW RELOAD THE CURRENT CANVAS DATA
	signaturePad.fromData(data);
}

//INITIALIZE THE CANVAS ELEMENT SETTINGS 
const init = () => {
	//THE ROW OF QUESTION NUMBERS
	let qNumsEl = $('questionNumbers');
	qNumsEl.innerHTML = '';

	//ADD A BUTTON TO THIS DIV FOR EACH QUESTION IN THIS ROUND
	for(let i = 0; i < questionsThisRound; i++){
		let qBtn = document.createElement('button');
		qBtn.id = 'Q' + (i+1);
		qBtn.className = 'qBtn';
		qBtn.innerHTML = 'Q' + (i + 1);
		qNumsEl.appendChild(qBtn);
		qBtn.onclick = (ev) => {
			//SAVE THE CURRENT CANVAS
			const data = signaturePad.toData();
			cnvData[currentQuestionNumber] = data;
			//THE BUTTON IDs are "Q1" -> "Q10"
			const qIndex = ev.target.id.substr(1,2);
			//STORE CURRENT QUESTION NUMBER
			currentQuestionNumber = parseInt(qIndex);
			highlightBtn(currentQuestionNumber);
			loadCanvasId(currentQuestionNumber);
		}
	}

	//ALSO ADD A CLEAR DATA AND A SUBMIT BUTTON TO THIS ROW?
	let resetBtn = document.createElement('button');
	resetBtn.onclick = () => {
		checkConfirm('THIS WILL DELETE ALL SAVED CANVASES', clearBackup);
	}
	resetBtn.className = 'resetBtn qBtn';
	resetBtn.innerHTML = 'Delete All';
	qNumsEl.appendChild(resetBtn);

	let submitBtn = document.createElement('button');
	submitBtn.onclick = () => {
		//THIS SHOULD SUBMIT - 
		backupCnvData();
	}
	submitBtn.className = 'saveBtn qBtn';
	submitBtn.innerHTML = 'Submit All';
	qNumsEl.appendChild(submitBtn);

	let clearBtn = document.createElement('button');
	clearBtn.onclick = () => {
		//THIS SHOULD SUBMIT - 
		clearCurrentCanvas();
	}
	clearBtn.className = 'clearBtn qBtn';
	clearBtn.innerHTML = 'Clear';
	qNumsEl.appendChild(clearBtn);



	//SHOW WE ARE ON QUESTION 1
	highlightBtn(currentQuestionNumber);
	//INITIALIZE THE CANVAS (THE HTML ELEMENT IS STORED AS cnvEl)
	cnvEl = document.getElementById('canvas');
	const canvas = document.querySelector("canvas");
	signaturePad = new SignaturePad(canvas);

	//CHECK FOR STORED DATA?
	if(window.localStorage.getItem('cnvData')){
		//console.log('LOADING STORED CANVASES', window.localStorage.getItem('cnvData'));
		cnvData = JSON.parse(window.localStorage.getItem('cnvData'));
		//THEN LOAD Q1 CANVAS
		loadCanvasId(currentQuestionNumber);
	}

	
	//ADD WINDOW RESIZE EVENT LISTENER
	window.addEventListener('resize', resizeCanvas, false);
	//TRIGGER THE RESIZE FUNCTION ONCE WINDOW LOADED
	resizeCanvas();

	window.addEventListener('unload', backupCnvData, false);

	//CANVAS ONCHANGE = SAVE TO THE cnvData ARRAY (DUPLICATING CANVASES, REMOVED)
	//cnvEl.addEventListener('change', storeCanvas, false);
}

/**
	* Where multiple stored canvases are found - loads by index of the cnvData array.
	* @param int id The cnvData index to load.
	* @return void Applies changes in browser.
	*/
const loadCanvasId = (id) => {
	//console.log('CANVAS LOAD', id, cnvData);
	signaturePad.clear();
	if(!cnvData[id]){
		//alert('No data to load!');
		console.log('No data to load!');
		return false;
	}
	//console.log('Loaded data', cnvData[id]);
	const data = cnvData[id];
	signaturePad.fromData(data);
	let modal = $('loadCanvasModal');
	modal.style.display = 'none';
}

//NOT CURRENTLY USED - WAS USING THIS IN AN onchange EVENT BUT LED TO DUPLICATED CANVASES
const storeCanvas = () => {
	const data = signaturePad.toData();
	cnvData[currentQuestionNumber] = data;
	alert('Saved as canvas #' + cnvData.length);
	//console.log(data);
}

//BACKS UP THE CANVAS DATA ARRAY TO LOCAL STORAGE FOR RELOADING
const backupCnvData = () => {
	window.localStorage.setItem('cnvData', JSON.stringify(cnvData));
}

//REMOVES ALL BACKED UP DATA
const clearBackup = () => {
	console.log('ALL SAVED DATA CLEARED!');
	window.localStorage.setItem('cnvData', undefined);
	//RESET CANVAS DATA AND RELOAD
	cnvData = [];
	location.reload();
}

//REMOVES ALL DATA FROM THE CURRENT CANVAS
const clearCurrentCanvas = () => {
	signaturePad.clear();
}

const createPreviewBox = (data, index) => {
	//A DIV TO WRAP THIS PREVIEW IN
	let pBox = document.createElement('div');
	pBox.className = 'previewBox';
	//A HEADING - WHICH WILL ALSO INCLUDE THE BUTTON TO LOAD THE CANVAS
	let pHead = document.createElement('h4');
	//1-INDEX FOR NORMIES
	pHead.innerHTML = 'Canvas #' + (index + 1) + ' ';
	//THE BUTTON TO LOAD THIS CANVAS PREVIEW
	let loadBtn = document.createElement('button');
	//USING 1-INDEX FOR NORMIES
	loadBtn.innerHTML = 'Load #' + (index + 1);
	loadBtn.className = 'loadBtn';
	loadBtn.id = index;
	loadBtn.onclick = (ev) => {
		loadCanvasId(ev.target.id);
	}
	pHead.appendChild(loadBtn);
	pBox.appendChild(pHead);
	//APPEND CANVAS WITH SIGNATURE PAD (DISABLED AND SCALED DOWN)
	let pCnv = document.createElement('canvas');
	pCnv.style.backgroundColor = '#fff';
	pCnv.id = index;
	pCnv.width = Math.floor(window.innerWidth / 2);
	pCnv.height = Math.floor(window.innerHeight / 2);
	let pPad = new SignaturePad(pCnv);
	pPad.off();
	pPad.fromData(data);
	pCnv.getContext("2d").scale(ratio / 2, ratio / 2);
	pBox.appendChild(pCnv);
	return pBox;
}

const highlightBtn = (index) => {
	//console.log('Highlight',index);
	let qBtns = document.querySelectorAll('.qBtn');
	qBtns.forEach( (el) => {
		if(el.id === ('Q' + index)){
			//console.log('Highlight found',el.id);
			el.classList.add('qHighlight');
		}else{
			el.classList.remove('qHighlight');
		}
	})
}

/*
* CHECK CONFIRMATION
* Description: Generic check, shows a confirmation box and callsback function only if confirmed
*
* @strConfirm: the string with specific text to show in the confirmation box
* @fnCallback: the function to callback if user confirms OK
*/
const checkConfirm = (strConfirm, fnCallback) => {
	const conf = confirm('Are you sure? ' + strConfirm);
	if (conf == true){
		fnCallback();
	}
}
