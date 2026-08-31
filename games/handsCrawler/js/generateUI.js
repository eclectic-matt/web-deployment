const handsEl = document.getElementById("hands");
const draggablePoolEl = document.getElementById("draggable-pool");

/*
<div id="leftHand">
	<div class="drop-zone" id="left-pinky" title="Left Pinky"></div>
	<div class="drop-zone" id="left-ring"></div>
	<div class="drop-zone" id="left-middle"></div>
	<div class="drop-zone" id="left-index"></div>
	<div class="drop-zone" id="left-thumb"></div>
</div>
<div id="rightHand">
	<div class="drop-zone" id="right-thumb"></div>
	<div class="drop-zone" id="right-index"></div>
	<div class="drop-zone" id="right-middle"></div>
	<div class="drop-zone" id="right-ring"></div>
	<div class="drop-zone" id="right-pinky"></div>
</div>
*/

const initUI = () => {
	generateEquipment();
	generateHands();
	setupDraggables();
	initTestButtons();
}

const generateHands = () => {
	let handNames = ["left", "right"];
	let fingerNames = ["pinky", "ring", "middle", "index", "thumb"];
	for(let hand = 1; hand <= 2; hand++)
	{
		let hand = document.createElement("div");
		let handName = handNames.shift();
		hand.id = handName + "Hand";
		for(let digit = 1; digit <= 5; digit++)
		{
			let finger = document.createElement("div");
			finger.id = handName + "-" + fingerNames[digit - 1];
			finger.title = handName + " " + fingerNames[digit - 1];
			finger.classList.add("drop-zone");
			hand.appendChild(finger);
		}
		handsEl.appendChild(hand);
		fingerNames.reverse();
	}
}

/*
<div class="draggable ring" id="basic-ring" title="Basic Ring">O</div>
<div class="draggable ring" id="wide-ring" title="Wide Ring">( )</div>
<div class="draggable ring" id="super-ring" title="Super Ring">[ ]</div>
*/
const generateEquipment = () => {
	let ringRarities = ["common", "uncommon", "rare", "mythic", "legendary"];
	let ringMaterials = ["wood", "copper", "iron", "steel", "crystal"];
	let ringTypes = ["mana", "strength", "vision", "knowledge", "boost"];
	let ringIcons = ["O", "0", "( )", "{ }", "[ ]"];
	for(let i = 0; i < ringRarities.length; i++)
	{
		let ring = document.createElement("div");
		ring.classList.add("draggable");
		ring.classList.add("ring");
		//Generate using the item generator
		
		//Generate a random ring
		let ringRarity = ringRarities[i];
		let ringMaterial = ringMaterials[Math.floor(Math.random() * ringMaterials.length)];
		let ringType = ringTypes[Math.floor(Math.random() * ringTypes.length)];
		let ringIcon = ringIcons[Math.floor(Math.random() * ringIcons.length)];
		//Generate the name/title
		ring.id = ringRarity + "-" + ringMaterial + "-" + ringType + "-ring";
		ring.title = ringRarity + " " + ringMaterial + " ring of " + ringType;
		ring.innerHTML = ringIcon;
		draggablePoolEl.appendChild(ring);
	}
}

const initTestButtons = () => 
{
  let physBtn = document.getElementById("btnTestPhysicalAttack");
  physBtn.addEventListener("click", (ev) => {
  	outputToTxt("physical attack");
  	//Get ring data
  });
  let magicBtn = document.getElementById("btnTestMagicalAttack");
}

const outputToTxt = (msg) => {
	document.getElementById("txtTestOutput").value += msg + "\n";
}