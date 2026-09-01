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
	//let ringMaterials = ["wood", "copper", "iron", "steel", "crystal"];
	//let ringTypes = ["mana", "strength", "vision", "knowledge", "boost"];
	//let ringIcons = ["O", "0", "( )", "{ }", "[ ]"];
	
	let generator = new ItemGenerator();
	
	for(let i = 1; i <= ringRarities.length; i++)
	{
		let ring = document.createElement("div");
		ring.classList.add("draggable");
		ring.classList.add("ring");
		//Generate using the item generator
		//let level = Math.floor(i / 3);
		//let ringData = generator.generateRing(i, i);
		let rarity = 1;
		let effect = generator.generateInt(1,4);
		let ringData = generator.generateRing(rarity, effect);
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
		//Create a score element which is shown when the ring scores
		let scoreEl = document.createElement("div");
		scoreEl.classList.add("popup-score");
		ring.appendChild(scoreEl);
		draggablePoolEl.appendChild(ring);
	}
}

const initTestButtons = () => 
{
  let physBtn = document.getElementById("btnTestPhysicalAttack");
  physBtn.addEventListener("click", (ev) => {
  	triggerPhysicalAttack();
  });
  let magicBtn = document.getElementById("btnTestMagicalAttack");
  let clearBtn = document.getElementById("btnClearTxt");
  clearBtn.addEventListener("click", () => {
  	clearTxt();
  });
}

const triggerPhysicalAttack = () => {
	outputToTxt("physical attack");
	  	//Get ring data
	  	let rings = document.querySelectorAll(".ring");
	  	let damage = new Damage();
	  	damage.base = 10;
	  	damage.power = 1;
	  	let delay = 0;
	  	for(let i = 0; i < rings.length; i++)
	  	{
	  	  let ring = rings[i];
	  	  //Get score popup for this ring
	  	  let popupEl = ring.firstElementChild;
	  	  //Extract ring data
	  	  let rarityName = ring.dataset.rarityName;
	  	  let rarityMultiplier = ring.dataset.rarityMultiplier;
	  	  let effectValue = ring.dataset.effectValue;
	  	  let effectName = ring.dataset.effectName;
	  	  let effectOp = ring.dataset.effectOperation;
	  	  outputToTxt("Scoring " + ring.id + " from base=" + damage.base + ", power=" + damage.power);
	  	  let scoringTypes = ["base", "power"];
	  	  let scoreContribution = 0;
	  	  let ringScores = false;
	  	  if(scoringTypes.includes(effectName))
	  	  {
	  	  	outputToTxt("Scoring possible for " + effectName + " for value = " + effectValue + ", rarity = " + rarityMultiplier);
		  	  switch(effectOp)
		  	  {
		  	  	case "add":
		  	  		ringScores = true;
		  	  		scoreContribution = (effectValue * rarityMultiplier); 
		  	  		damage[effectName] += scoreContribution;
		  	  		break;
		  	  	case "multiply":
		  	  		ringScores = true;
		  	  		scoreContribution = (effectValue * rarityMultiplier);
		  	  		damage[effectName] *= scoreContribution;
		  	  		break;
		  	  }
	  	  }
	  	  if(ringScores === true)
	  	  {
	  			//Display popups with 0.5s delay
	  	  	setTimeout(scoreRing, delay, ring);
	  	  	//Add 500ms to delay
	  	  	delay += 500;
	  	  }
	  	}
	  	
	  	damage.total = damage.base * damage.power;
	  	outputToTxt("Final Base = " + damage.base);
	  	outputToTxt("Final Power = " + damage.power);
	  	outputToTxt("Total Damage = " + damage.total);
	  	//Add 1s to delay to allow popups to finish animating
	  	delay += 1000;
	  	//Clear popups classes for next scoring
	  	setTimeout(clearPopups, delay);
}

const scoreRing = (ring) => 
{
	let popupEl = ring.firstElementChild;
	//Extract ring data
	let rarityName = ring.dataset.rarityName;
	let rarityMultiplier = ring.dataset.rarityMultiplier;
	let effectValue = ring.dataset.effectValue;
	let effectName = ring.dataset.effectName;
	let effectOp = ring.dataset.effectOperation;
	let scoringTypes = ["base", "power"];
	let scoreContribution = 0;
	let popupString = "";
	if (scoringTypes.includes(effectName))
	{
		outputToTxt("Scoring possible for " + effectName + " for value = " + effectValue + ", rarity = " + rarityMultiplier);
		switch (effectOp)
		{
			case "add":
				scoreContribution = (effectValue * rarityMultiplier);
				popupString = "+" + scoreContribution;
				break;
			case "multiply":
				scoreContribution = (effectValue * rarityMultiplier);
				popupString = "x" + scoreContribution;
				break;
		}
	}
	if (popupString !== "")
	{
		//Show the popup element
		popupEl.innerHTML = popupString;
		popupEl.classList.add("show");
	}
}

const clearPopups = () => {
	let rings = document.querySelectorAll(".ring");
	for(let i = 0; i < rings.length; i++)
	{
		let ring = rings[i];
	  //Get score popup for this ring
	  let popupEl = ring.firstElementChild;
	  //Clear data and show class
	  popupEl.innerHTML = "";
	  popupEl.classList.remove("show");
	}
}

const scoreDamage = (damage, ring) => {
	
}

const outputToTxt = (msg) => {
	document.getElementById("txtTestOutput").value += msg + "\n";
}

const clearTxt = () => {
	document.getElementById("txtTestOutput").value = "";
}