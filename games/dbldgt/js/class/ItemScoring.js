class ItemScoring 
{
	//Element references
	#physicalAttackBtnEl = null;
	#magicalAttackBtnEl = null;
	#clearHandsBtnEl = null;
	#scoreDelayMs = 500;
	//The types of effect that change scoring
	#scoringTypes = [
		"base",   //Add/Multiply Base
		"power",  //Add/Multiply Power
		"totalMultiplier"		//Multiply Total
	];
	#targetOrderIDs = [
		//HELD ITEMS TRIGGER FIRST
		"placed-left-held-item",
		"placed-right-held-item",
		//THEN LEFT HAND FINGERS
		"placed-left-pinky",
		"placed-left-ring",
		"placed-left-middle",
		"placed-left-index",
		"placed-left-thumb",
		//THEN RIGHT HAND FINGERS
		"placed-right-thumb",
		"placed-right-index",
		"placed-right-middle",
		"placed-right-ring",
		"placed-right-pinky",
		//THEN TATTOOS
		"placed-left-tattoo",
		"placed-right-tattoo",
		//THEN BRACELETS
		"placed-left-bracelet",
		"placed-right-bracelet"
	];
	
	constructor()
	{
		//this.initTestButtons();
	}

	triggerPhysicalAttack = async () => 
	{
		// Clear old text first so you can clearly see the new calculations run step-by-step
		this.clearTxt();
		console.log('--- Starting Physical Attack Scoring Cycle ---');
		this.outputToTxt("physical attack");
		this.resetScores();
		
		let scoringItems = [];
		
		// Scan through the exact order tracking index matrix
		this.#targetOrderIDs.forEach(id =>
		{
			const foundRingElement = document.getElementById(id);
			if (foundRingElement)
			{
				scoringItems.push(foundRingElement);
			}
		});
		
		//console.log('Aggregated active items sorted in exact order:', scoringItems.map(r => r.id));

		let damage = new Damage();
		damage.base = 10;
		damage.power = 1;
		damage.totalMultiplier = 1;
		damage.total = 0;
		
		for(let i = 0; i < scoringItems.length; i++)
		{
			let scoringItem = scoringItems[i];
			
			// Target Debugging Lookups
			//console.log(`Inspecting element [Index: ${i}, ID: ${scoringItem.id}]:`, scoringItem.dataset);
			
			let rarityMultiplier = Number(scoringItem.dataset.rarityMultiplier || 1);
			let effectValue = Number(scoringItem.dataset.effectValue || 0);
			let effectName = scoringItem.dataset.effectName;
			let effectOp = scoringItem.dataset.effectOperation;
			
			let scoreContribution = 0;
			let ringScores = false;
			
			if(this.#scoringTypes.includes(effectName))
			{
				//console.log(`Matched valid scoring type "${effectName}" for item ${scoringItem.id}. Value: ${effectValue}, Multiplier: ${rarityMultiplier}`);
				this.outputToTxt("Scoring possible for " + effectName + " for value = " + effectValue + ", rarity = " + rarityMultiplier);
				
				switch(effectOp)
				{
				  //Set the current value (overwrite)
				  case "set":
				    ringScores = true;
						scoreContribution = (effectValue * rarityMultiplier); 
						damage[effectName] = scoreContribution;
						//console.log(`Operation [SET]: Contribution calculated as ${scoreContribution}. New damage.${effectName} running total = ${damage[effectName]}`);
				  break;
				  //Add to the current value
					case "add":
						ringScores = true;
						scoreContribution = (effectValue * rarityMultiplier); 
						damage[effectName] += scoreContribution;
						//console.log(`Operation [ADD]: Contribution calculated as ${scoreContribution}. New damage.${effectName} running total = ${damage[effectName]}`);
					break;
					//Multiply the current value
					case "multiply":
						ringScores = true;
						scoreContribution = (effectValue * rarityMultiplier);
						damage[effectName] *= scoreContribution;
						//console.log(`Operation [MULTIPLY]: Contribution calculated as ${scoreContribution}. New damage.${effectName} running total = ${damage[effectName]}`);
					break;
					default:
						console.warn(`Unrecognised effect operation type "${effectOp}" on element ${scoringItem.id}`);
					break;
				}
			}
			else
			{
				console.log(`Skipping item ${scoringItem.id}: effect classification "${effectName}" does not match targeted scoring groups [base, power]`);
			}
			
			if(ringScores)
			{
				this.outputToTxt("Scoring " + scoringItem.id + " from base=" + damage.base + ", power=" + damage.power);
				//console.log(`Triggering visual score animation for ${scoringItem.id}`);
				this.scoreRing(scoringItem);
				
				//Calculate the total at each step
				damage.total = damage.totalMultiplier * damage.base * damage.power;
				
				this.setTotalScore(damage.total);
				
				console.log('Calculation Step Complete. Current Stats:', damage);
				// This holds the loop frame open for 500ms so you can view the changes update incrementally
				await sleep(this.#scoreDelayMs);
			}
		}
		
		if(damage.total === 0)
		{
			// Update total (if no rings scored)
			damage.total = damage.totalMultiplier * damage.base * damage.power;
			
			this.updateTotalScore(damage.total);
		}
	  
		this.outputToTxt("Final Base = " + damage.base);
		this.outputToTxt("Final Power = " + damage.power);
		this.outputToTxt("Final TotalMultiplier = " + damage.totalMultiplier);
		this.outputToTxt("Total Damage = " + damage.total);
		
		// Allow 1s for final total text to be read/animated before cleaning up components
		console.log('All updates pushed to DOM view layers. Pausing execution before clearing temporary overlay popups...');
		await sleep(2 * this.#scoreDelayMs);
		this.clearPopups();
		console.log('--- Scoring Cycle Execution Loop Completed Cleanly ---');
	}
	
	resetScores = () =>
	{
		console.log('Resetting scoreboard elements to baseline specifications.');
		document.getElementById("baseScore").innerHTML = 10;
		document.getElementById("powerScore").innerHTML = 1;
		document.getElementById("totalScore").innerHTML = 0;
	}
	
	scoreRing = (scoringItem) =>
	{
		let popupEl = scoringItem.firstElementChild;
		if (!popupEl)
		{
			console.error(`Popup structural layout anomaly: First child node missing inside wrapper element ${scoringItem.id}`);
			return;
		}
		
		let rarityMultiplier = Number(scoringItem.dataset.rarityMultiplier || 1);
		let effectValue = Number(scoringItem.dataset.effectValue || 0);
		let effectName = scoringItem.dataset.effectName;
		let effectOp = scoringItem.dataset.effectOperation;
		let scoreContribution = 0;
		let popupString = "";
		
		if (this.#scoringTypes.includes(effectName))
		{
			switch (effectOp)
			{
				case "set":
					scoreContribution = (effectValue * rarityMultiplier);
					popupString = "=" + scoreContribution;
					if (effectName === "base") this.setBaseScore(scoreContribution);
					if (effectName === "power") this.setPowerScore(scoreContribution);
					//if (effectName === "totalMultiplier") this.setTotalScore(scoreContribution);
				break;
				case "add":
					scoreContribution = (effectValue * rarityMultiplier);
					popupString = "+" + scoreContribution;
					if (effectName === "base") this.addBaseScore(scoreContribution);
					if (effectName === "power") this.addPowerScore(scoreContribution);
					//if (effectName === "totalMultiplier") this.addTotalScore(scoreContribution);
				break;
				case "multiply":
					scoreContribution = (effectValue * rarityMultiplier);
					popupString = "x" + scoreContribution;
					if (effectName === "base") this.multiplyBaseScore(scoreContribution);
					if (effectName === "power") this.multiplyPowerScore(scoreContribution);
					//if (effectName === "totalMultiplier") this.multiplyTotalScore(scoreContribution);
				break;
			}
		}
		
		if (popupString !== "")
		{
			//console.log(`Setting Popup markup contents for ${scoringItem.id} to "${popupString}"`);
			popupEl.innerHTML = popupString;
			switch(effectName)
			{
				case "base":
					popupEl.style.backgroundColor = "var(--base-score-color)";
				break;
				case "power":
					popupEl.style.backgroundColor = "var(--power-score-color)";
				break;
				case "totalMultiplier":
					popupEl.style.backgroundColor = "var(--total-score-color)";
				break;
			}
			popupEl.classList.add("show");
		}
	}

	setBaseScore = (base) =>
	{
		document.getElementById("baseScore").innerHTML = this.numberWithCommas(base);
	}
	
	addBaseScore = (base) =>
	{
		let previous = parseInt(document.getElementById("baseScore").innerHTML.replaceAll(",","")) || 0;
		base = previous + base;
		document.getElementById("baseScore").innerHTML = this.numberWithCommas(base);
	}

	multiplyBaseScore = (multiplier) =>
	{
		let previous = parseInt(document.getElementById("baseScore").innerHTML.replaceAll(",","")) || 0;
		let base = previous * multiplier;
		document.getElementById("baseScore").innerHTML = this.numberWithCommas(base);
	}

	setPowerScore = (power) =>
	{
		document.getElementById("powerScore").innerHTML = this.numberWithCommas(power);
	}
	
	addPowerScore = (power) => 
	{
		let previous = parseInt(document.getElementById("powerScore").innerHTML.replaceAll(",","")) || 0;
		power = previous + power;
		document.getElementById("powerScore").innerHTML = this.numberWithCommas(power);
	}

	multiplyPowerScore = (multiplier) =>
	{
		let previous = parseInt(document.getElementById("powerScore").innerHTML.replaceAll(",","")) || 0;
		let power = previous * multiplier;
		document.getElementById("powerScore").innerHTML = this.numberWithCommas(power);
	}
	
	setTotalScore = (total) =>
	{
		document.getElementById("totalScore").innerHTML = this.numberWithCommas(total);
	}
	
	addTotalScore = (total) => 
	{
		let previous = parseInt(document.getElementById("totalScore").innerHTML.replaceAll(",","")) || 0;
		total = previous + total;
		document.getElementById("totalScore").innerHTML = this.numberWithCommas(total);
	}

	multiplyTotalScore = (multiplier) =>
	{
		let previous = parseInt(document.getElementById("totalScore").innerHTML.replaceAll(",","")) || 0;
		let total = previous * multiplier;
		document.getElementById("totalScore").innerHTML = this.numberWithCommas(total);
	}
	
	updateTotalScore = (total) => 
	{
		let previous = parseInt(document.getElementById("totalScore").innerHTML.replaceAll(",","")) || 0;
		total = previous + total;
		document.getElementById("totalScore").innerHTML = this.numberWithCommas(total);
	}

  numberWithCommas = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


	clearPopups = () => 
	{
		console.log('Clearing visibility states and content values from animation overlay tracking node references.');
		let rings = document.querySelectorAll(".ring-wrapper");
		for(let i = 0; i < rings.length; i++)
		{
			let ring = rings[i];
			let popupEl = ring.firstElementChild;
			if (popupEl)
			{
				popupEl.innerHTML = "";
				popupEl.classList.remove("show");
			}
		}
	}

	outputToTxt = (msg) => 
	{
		let txtOutput = document.getElementById("txtTestOutput");
		if (txtOutput) {
			txtOutput.value += msg + "\n";
		}
	}

	clearTxt = () => 
	{
		let txtOutput = document.getElementById("txtTestOutput");
		if (txtOutput) {
			txtOutput.value = "";
		}
	}
	
	clearHands = () => 
	{
		let handElements = document.querySelectorAll('.ring-wrapper');
		for(let i = 0; i < handElements.length; i++)
		{
			let handEl = handElements[i];
			handEl.parentElement.removeChild(handEl);
		}
	}
}