var json;

const loadData = () => {
	getJSON("./data/honeyHeist.json", storeData);
}

const storeData = (status, data) => {
	json = data;
	console.log(json);
}

const randomCharacter = () => {
	//console.log('data loaded', data);

	
	//SECTIONS TO GENERATE
	//descriptor
	let dIndex = Math.floor(Math.random() * json.players.descriptor.length);
	let descriptor = json.players.descriptor[dIndex];

	//typeAndSkill
	let tIndex = Math.floor(Math.random() * json.players.typeAndSkill.length);
	let typeAndSkill = json.players.typeAndSkill[tIndex];

	//role
	let rIndex = Math.floor(Math.random() * json.players.role.length);
	let role = json.players.role[tIndex];

	//hat
	let hIndex = Math.floor(Math.random() * json.players.hat.length);
	let hat = json.players.hat[hIndex];

	//NICE GRAMMAR FORMAT FOR DESCRIPTOR
	if(["a","e","i","o","u"].includes(descriptor.slice(0, 1).toLowerCase())){
		descriptor = "an " + descriptor;
	}else{
		descriptor = "a " + descriptor
	}

	//OUTPUT TO PAGE
	let charEl = document.getElementById('character');
	charEl.innerHTML = 'You are <em>' + descriptor + ' ' + typeAndSkill.name + '</em> bear (special skill: <em>' + typeAndSkill.skill + '</em>) who is this Heist\'s <b>"' + role + '"</b> wearing a <em>' + hat + '</em> hat';

	//DISGUISE AND HBS 
	
	//TOP
	let topDIndex = Math.floor(Math.random() * json.players.outfit.top.descriptor.length);
	let topDescriptor = json.players.outfit.top.descriptor[topDIndex];
	
	let topIIndex = Math.floor(Math.random() * json.players.outfit.top.item.length);
	let topItem = json.players.outfit.top.item[topIIndex];
	
	//BOTTOM
	let btmDIndex = Math.floor(Math.random() * json.players.outfit.bottom.descriptor.length);
	let btmDescriptor = json.players.outfit.bottom.descriptor[btmDIndex];
	
	let btmIIndex = Math.floor(Math.random() * json.players.outfit.bottom.item.length);
	let btmItem = json.players.outfit.bottom.item[btmIIndex];
	
	//ACCESSORY 
	let accIndex = Math.floor(Math.random() * json.players.outfit.accessory.length);
	let accItem = json.players.outfit.accessory[accIndex].item;
	let accMod = json.players.outfit.accessory[accIndex].scoreModifier;
	
	//CALCULATE HBS 
	let hbs = (topDIndex +1) + (topIIndex +1) + (btmDIndex +1) + (btmIIndex +1) + parseInt(accMod);
	
	//OUTPUT
	let outfitEl = document.getElementById('outfit');
	outfitEl.innerHTML = '<p>Your clothing: a <em>' + topDescriptor + ' ' + topItem + '</em>, <em>' + btmDescriptor + ' ' + btmItem + '</em> and a <em>' + accItem + '</em>.</p><p>Your Human Believability Score (HBS): <b>' + hbs + '</b>.</p>';
}

const randomHeist = () => {
	let oIndex = Math.floor(Math.random() * json.GM.conventionOrganizer.length);
	let organizer = json.GM.conventionOrganizer[oIndex];

	let lAdjIndex = Math.floor(Math.random() * json.GM.conventionLocation.adjective.length);
	let locationAdjective = json.GM.conventionLocation.adjective[lAdjIndex];

	let lDesIndex = Math.floor(Math.random() * json.GM.conventionLocation.description.length);
	let locationDescription = json.GM.conventionLocation.description[lDesIndex];

	let pIndex = Math.floor(Math.random() * json.GM.heistPrize.length);
	let prize = json.GM.heistPrize[pIndex];

	let sIndex = Math.floor(Math.random() * json.GM.heistSecret.length);
	let secret = json.GM.heistSecret[sIndex];

	let secIndex1 = Math.floor(Math.random() * json.GM.securityFeatures.length);
	let security1 = json.GM.securityFeatures[secIndex1];

	let secIndex2 = secIndex1;
	let security2 = '';

	while(secIndex2 === secIndex1){
		secIndex2 = Math.floor(Math.random() * json.GM.securityFeatures.length);
		security2 = json.GM.securityFeatures[secIndex2];
	}

	//OUTPUT
	let heistEl = document.getElementById('heist');
	heistEl.innerHTML = '<h2>HesitCon 2017</h2><p>Organizer: ' + organizer + '</p><p>Location: ' + locationAdjective + ' ' + locationDescription + ".</p><p>Prize: " + prize + '</p><p><em>Secret: ' + secret + '</em></p>The security features are: <ul><li>' + security1 + '</li><li> ' + security2 + '</li></ul>';

}

const getJSON = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'json';
	xhr.onload = function() {
		var status = xhr.status;
		if (status === 200) {
			callback(null, xhr.response);
		} else {
			callback(status, xhr.response);
		}
	};
	xhr.send();
};
