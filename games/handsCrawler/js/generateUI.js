const handsEl = document.getElementById("hands");
const draggablePoolEl = document.getElementById("draggable-pool");

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
			finger.classList.add("finger");
			hand.appendChild(finger);
		}
		handsEl.appendChild(hand);
		fingerNames.reverse();
	}
}


const generateEquipment = () => {
	let ringRarities = ["common", "uncommon", "rare", "mythic", "legendary"];
	let ringMaterials = ["wood", "copper", "iron", "steel", "crystal"];
	let ringTypes = ["mana", "strength", "vision", "knowledge", "boost"];
	let ringIcons = ["O", "0", "( )", "{ }", "[ ]"];
	
	let generator = new ItemGenerator();
	
	for(let i = 1; i <= ringRarities.length; i++)
	{
		let ring = document.createElement("div");
		ring.classList.add("draggable");
		ring.classList.add("ring");
		//Generate using the item generator
		let ringData = generator.generateRing(i, i);
		outputToTxt(ringData.effect.name + " " + ringData.effect.operation);
		//Set data on element
		ring.dataset.rarityName = ringData.rarity.name;
		ring.dataset.rarityMultiplier = ringData.rarity.multiplier;
		ring.dataset.effectName = ringData.effect.name;
		ring.dataset.effectOperation = ringData.effect.operation;
		ring.dataset.effectValue = ringData.effect.value;
		
		ring.title = ringData.rarity.name + " Ring of " + ringData.effect.operation + " " + ringData.effect.name;
		ring.id = ringData.rarity.name + "-" + ringData.effect.operation + "-" + ringData.effect.name + "-ring";
		ring.innerHTML = "O";
		
		/*
		//Generate a random ring
		let ringRarity = ringRarities[i];
		let ringMaterial = ringMaterials[Math.floor(Math.random() * ringMaterials.length)];
		let ringType = ringTypes[Math.floor(Math.random() * ringTypes.length)];
		let ringIcon = ringIcons[Math.floor(Math.random() * ringIcons.length)];
		//Generate the name/title
		ring.id = ringRarity + "-" + ringMaterial + "-" + ringType + "-ring";
		ring.title = ringRarity + " " + ringMaterial + " ring of " + ringType;
		ring.innerHTML = ringIcon;
		*/
		draggablePoolEl.appendChild(ring);
	}
}

const initTestButtons = () => 
{
  let physBtn = document.getElementById("btnTestPhysicalAttack");
  physBtn.addEventListener("click", (ev) => {
  	outputToTxt("physical attack");
  	//Get ring data
  	let rings = document.querySelectorAll(".ring");
  	let damage = new Damage();
  	damage.base = 10;
  	damage.power = 1;
  	for(let i = 0; i < rings.length; i++)
  	{
  	  let ring = rings[i];
  	  //Extract ring data
  	  let rarityName = ring.dataset.rarityName;
  	  let rarityMultiplier = ring.dataset.rarityMultiplier;
  	  let effectValue = ring.dataset.effectValue;
  	  let effectName = ring.dataset.effectName;
  	  let effectOp = ring.dataset.effectOperation;
  	  outputToTxt("Scoring " + ring.id + " from base=" + damage.base + ", power=" + damage.power);
  	  let scoringTypes = ["base", "power"];
  	  if(scoringTypes.includes(effectName))
  	  {
  	  	outputToTxt("Scoring possible for " + effectName + " for value = " + effectValue + ", rarity = " + rarityMultiplier);
	  	  switch(effectOp)
	  	  {
	  	  	case "add":
	  	  		damage[effectName] += (effectValue * rarityMultiplier);
	  	  		break;
	  	  	case "multiply":
	  	  		damage[effectName] *= (effectValue * rarityMultiplier);
	  	  		break;
	  	  }
  	  }
  	}
  	damage.total = damage.base * damage.power;
  	outputToTxt("Final Base = " + damage.base);
  	outputToTxt("Final Power = " + damage.power);
  	outputToTxt("Total Damage = " + damage.total);
  });
  let magicBtn = document.getElementById("btnTestMagicalAttack");
}

const scoreDamage = (damage, ring) => {
	
}

const outputToTxt = (msg) => {
	document.getElementById("txtTestOutput").value += msg + "\n";
}