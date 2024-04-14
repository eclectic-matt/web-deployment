var json;

const loadData = () => {
	getJSON('./data/honeyHeist.json', storeData);
}

const storeData = (status, data) => {
	json = data;
	//console.log(json);
 updateOptions(data);
}

const updateOptions = (data) => {

  let select = document.getElementById('descriptor');
  data.players.descriptor.forEach( (name) => {
   let option = document.createElement('option');
   option.value = name;
   option.innerHTML = name;
   select.appendChild(option);
});

select = document.getElementById('type'); data.players.typeAndSkill.forEach( (type) => {
   let option = document.createElement('option');
   option.value = type.name;
   option.innerHTML = type.name;
   select.appendChild(option);
});

select = document.getElementById('role');
data.players.role.forEach( (role) => {
   let option = document.createElement('option');
   option.value = role;
   option.innerHTML = role;
   select.appendChild(option);
});

select = document.getElementById('hat');
data.players.hat.forEach( (hat) => {
   let option = document.createElement('option');
   option.value = hat;
   option.innerHTML = hat;
   select.appendChild(option);
});

select = document.getElementById('topDescriptor');
data.players.outfit.top.descriptor.forEach( (name) => {
   let option = document.createElement('option');
   option.value = name;
   option.innerHTML = name;
   select.appendChild(option);
});

select = document.getElementById('topItem');
data.players.outfit.top.item.forEach( (name) => {
   let option = document.createElement('option');
   option.value = name;
   option.innerHTML = name;
   select.appendChild(option);
});

select = document.getElementById('btmDescriptor');
data.players.outfit.bottom.descriptor.forEach( (name) => {
   let option = document.createElement('option');
   option.value = name;
   option.innerHTML = name;
   select.appendChild(option);
});

select = document.getElementById('btmItem');
data.players.outfit.bottom.item.forEach( (name) => {
   let option = document.createElement('option');
   option.value = name;
   option.innerHTML = name;
   select.appendChild(option);
});


select = document.getElementById('accessory');
data.players.outfit.accessory.forEach( (accessory) => {
   let option = document.createElement('option');
   option.value = accessory.item;
   option.innerHTML = accessory.item;
   select.appendChild(option);
});

}

const randomCharacter = () => {
	//console.log('data loaded', data);
 openPanel('character');
	
	//SECTIONS TO GENERATE
	//descriptor
	let dIndex = Math.floor(Math.random() * json.players.descriptor.length);
	let descriptor = json.players.descriptor[dIndex];
 document.getElementById('descriptor').selectedIndex = (dIndex + 1);

	//typeAndSkill
	let tIndex = Math.floor(Math.random() * json.players.typeAndSkill.length);
	let typeAndSkill = json.players.typeAndSkill[tIndex];
document.getElementById('type').selectedIndex = (tIndex + 1);
document.getElementById('skill').innerHTML = typeAndSkill.skill;

	//role
	let rIndex = Math.floor(Math.random() * json.players.role.length);
	let role = json.players.role[tIndex];
document.getElementById('role').selectedIndex = (rIndex + 1);

	//hat
	let hIndex = Math.floor(Math.random() * json.players.hat.length);
	let hat = '';

//HANDLE ROLL TWICE HATS
if(hIndex === (json.players.hat.length - 1)){

  //ROLL AGAIN AND CONCATENATE
  let hIndex1 = Math.floor(Math.random() * json.players.hat.length - 1);
  hat = json.players.hat[hIndex1];
  
  //REMOVE CURRENT HAT AND ROLL AGAIN
  let otherHats = json.players.hat.filter( (h) => { return ((h !== hat) && (h !== 'Roll Twice')); });
  //GET ANOTHER HAT
  let hIndex2 = Math.floor(Math.random() *   otherHats.length);
  //CONCAT THIS HAT
  hat += ' and a ' + otherHats[hIndex2];
  
}else{
   //STORE SINGLE HAT 
   hat = json.players.hat[hIndex];
document.getElementById('hat').selectedIndex = (hIndex + 1);
}

	//NICE GRAMMAR FORMAT FOR DESCRIPTOR
	if(['a','e','i','o','u'].includes(descriptor.slice(0, 1).toLowerCase())){
		descriptor = 'an ' + descriptor;
	}else{
		descriptor = 'a ' + descriptor
	}

	//OUTPUT TO PAGE
	//let charEl = document.getElementById('generatedCharacter');
	//charEl.innerHTML = 'You are <em>' + descriptor + ' ' + typeAndSkill.name + '</em> bear (special skill: <em>' + typeAndSkill.skill + '</em>) who is this Heist\'s <b>"' + role + '"</b> wearing a <em>' + hat + '</em> hat';

	//DISGUISE AND HBS 
	
	//TOP
	let topDIndex = Math.floor(Math.random() * json.players.outfit.top.descriptor.length);
	let topDescriptor = json.players.outfit.top.descriptor[topDIndex];
document.getElementById('topDescriptor').selectedIndex = (topDIndex + 1);
	
	let topIIndex = Math.floor(Math.random() * json.players.outfit.top.item.length);
	let topItem = json.players.outfit.top.item[topIIndex];
document.getElementById('topItem').selectedIndex = (topIIndex + 1);
	
	//BOTTOM
	let btmDIndex = Math.floor(Math.random() * json.players.outfit.bottom.descriptor.length);
	let btmDescriptor = json.players.outfit.bottom.descriptor[btmDIndex];
document.getElementById('btmDescriptor').selectedIndex = (btmDIndex + 1);
	
	let btmIIndex = Math.floor(Math.random() * json.players.outfit.bottom.item.length);
	let btmItem = json.players.outfit.bottom.item[btmIIndex];
document.getElementById('btmItem').selectedIndex = (btmIIndex + 1);
	
	//ACCESSORY 
	let accIndex = Math.floor(Math.random() * json.players.outfit.accessory.length);
	let accItem = json.players.outfit.accessory[accIndex].item;
	let accMod = json.players.outfit.accessory[accIndex].scoreModifier;
document.getElementById('accessory').selectedIndex = (accIndex + 1);
document.getElementById('accessoryModifier').innerHTML = accMod;
	
	//CALCULATE HBS 
	let hbs = (topDIndex +1) + (topIIndex +1) + (btmDIndex +1) + (btmIIndex +1) + parseInt(accMod);
document.getElementById('HBS').innerHTML = hbs;
	
	//OUTPUT
	//let outfitEl = document.getElementById('outfit');
	//outfitEl.innerHTML = '<p>Your clothing: a <em>' + topDescriptor + ' ' + topItem + '</em>, <em>' + btmDescriptor + ' ' + btmItem + '</em> and a <em>' + accItem + '</em>.</p><p>Your Human Believability Score (HBS): <b>' + hbs + '</b>.</p>';
}

const randomHeist = () => {

 openPanel('heist');

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
	let heistEl = document.getElementById('generatedHeist');
	heistEl.innerHTML = '<h2>HoneyCon 2017</h2><p><b>Organizer: </b>' + organizer + '</p><p><b>Location: </b>' + locationAdjective + ' ' + locationDescription + ".</p><p><b>Prize: </b>" + prize + '</p><p><em>Secret: ' + secret + '</em></p><b>Security features: </b><ul><li><b>' + security1 + '</b></li><li><b>' + security2 + '</b></li></ul>';

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
