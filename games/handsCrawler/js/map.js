class RingMapUi
{
	//INIT MAIN VARS
	#draggedRingSrc = null;
	#draggedRingDataset = null;
	#dragVisualElement = null;
	#itemData = null;
	#isDragging = false;
	//The hands element target dimensions
	#targetWidth = 540;
	#targetHeight = 420;
	#inventoryTypes = ['ring', 'bracelet', 'held', 'tattoo'];
	//SET CLASS NAMES / TAGS / IDs
	#ringItemsClassName = 'item';
	#dragVisualElementId = 'drag-visual';
	#dropAreaTagName = 'area';
	#ringHighlightClassName = 'ring-highlight-overlay';
	#gameScalerId = 'game-scaler';
	#ringOptionsElementId = 'ring-options';
	//THE JSON DATA PATH
	#itemDataJsonPath = './data/itemData.json';
	//ELEMENT REFERENCES
	#ringOptionsAreaEl = null;
	#inventoryRingsEl = null;
	#inventoryBraceletEl = null;
	#inventoryHeldEl = null;
	#inventoryTattooEl = null;
	#scalerEl = null;
	#visualEls = null;
	
	//===================
	// INIT
	//===================
	
	//Just setup initial document references
	constructor()
	{
		//Init references to document
		this.#ringOptionsAreaEl = document.getElementById(this.#ringOptionsElementId);
		if (this.#ringOptionsAreaEl)
		{
			this.#ringOptionsAreaEl.innerHTML = '';
		}
		this.#scalerEl = document.getElementById(this.#gameScalerId);
		this.#visualEls = document.querySelectorAll('#' + this.#dragVisualElementId);
		
		// Explicitly bind the init function context so it preserves 'this' inside promises
		this.loadItemData().then(this.init.bind(this));
	}
	
	async loadItemData()
	{
		try
		{
			//console.log(this.#itemDataJsonPath);
			const response = await fetch(this.#itemDataJsonPath);
			
			if (!response.ok)
			{
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			
			this.#itemData = await response.json();
			let ringsInfo = this.#itemData.items.rings;
			
			//Create inventory sections
			for(let i = 0; i < this.#inventoryTypes.length; i++)
			{
				let typeName = this.#inventoryTypes[i];
				//Skip type if not found
				if(ringsInfo.filter(r => { return r.type === typeName; }).length < 1) continue;
				let inventorySection = document.createElement('section');
				inventorySection.id = 'inventory-' + typeName;
				let inventorySectionHeading = document.createElement('h4');
				inventorySectionHeading.innerHTML = typeName.toUpperCase();
				inventorySection.appendChild(inventorySectionHeading);
				this.#ringOptionsAreaEl.appendChild(inventorySection);
			}
			
			ringsInfo.forEach(r => 
			{
				let ringImg = document.createElement('img');
				ringImg.src = r.icon;
				//ringImg.className = this.#ringItemsClassName;
				//Add class '.item'
				ringImg.classList.add('item');
				//Add class '.ring'/'.bracelet' etc
				ringImg.classList.add(r.type);
				ringImg.dataset.itemType = r.type;
				ringImg.draggable = true;
				ringImg.id = r.id;
				ringImg.alt = r.name;
				ringImg.title = r.name;
				ringImg.dataset.rarityName = r.rarity.name;
				ringImg.dataset.rarityMultiplier = r.rarity.multiplier;
				ringImg.dataset.effectValue = r.effect.value;
				ringImg.dataset.effectName = r.effect.name;
				ringImg.dataset.effectOperation = r.effect.operation;
				
				document.getElementById('inventory-' + r.type).appendChild(ringImg);
			});
		}
		catch (error)
		{
			console.error("Failed to load JSON file:", error);
		}
	}
	
	init()
	{
		// Setup scaling view recalculation events using .bind(this) to avoid context crashes
		window.addEventListener('resize', this.resizeGameViewport.bind(this));
		window.addEventListener('DOMContentLoaded', this.resizeGameViewport.bind(this));
		this.initDragEvents();
		this.resizeGameViewport(); // Run an initial setup execution immediately
	}
	
	//===================
	// EVENTS
	//===================

	initDragEvents()
	{
		//APPLY DRAG EVENTS FOR EACH RING
		document.querySelectorAll('.' + this.#ringItemsClassName)
		.forEach(ring => 
		{
			// --- UNIFIED POINTER DOWN (Mouse & Touch) ---
			ring.addEventListener('pointerdown', (e) => {
				const imgElement = e.currentTarget.tagName === 'IMG' ? e.currentTarget : e.currentTarget.querySelector('img');
				if (!imgElement) return;

				this.#isDragging = true;
				this.#draggedRingSrc = imgElement.src;
				this.#draggedRingDataset = imgElement.dataset;
				this.highlightDropAreas(true);
		
				ring.setPointerCapture(e.pointerId);
				this.clearDragVisualElements();

				this.#dragVisualElement = document.createElement('img');
				this.#dragVisualElement.id = this.#dragVisualElementId;
				this.#dragVisualElement.src = this.#draggedRingSrc;
				this.#dragVisualElement.style.position = 'fixed';
				this.#dragVisualElement.style.width = `${imgElement.offsetWidth}px`;
				this.#dragVisualElement.style.height = `${imgElement.offsetHeight}px`;
				this.#dragVisualElement.style.pointerEvents = 'none';
				this.#dragVisualElement.style.zIndex = '9999';
				this.updateVisualPosition(e.clientX, e.clientY);
				document.body.appendChild(this.#dragVisualElement);
			});
		
			// --- UNIFIED POINTER MOVE ---
			ring.addEventListener('pointermove', (e) => {
				if (!this.#isDragging || !this.#dragVisualElement) return;
				this.updateVisualPosition(e.clientX, e.clientY);
				this.updateActiveHoverState(e.clientX, e.clientY);
			});
		
			// --- UNIFIED POINTER UP / RELEASE ---
			ring.addEventListener('pointerup', (e) => {
				if (!this.#isDragging) return;
				
				this.highlightDropAreas(false);
				this.#isDragging = false;
				
				try {
					ring.releasePointerCapture(e.pointerId);
				} catch (err) {
					// Ignore if capture was already released
				}
				
				if (this.#dragVisualElement) {
					this.#dragVisualElement.remove();
					this.#dragVisualElement = null;
				}
				
				let targetArea = this.findTargetAreaAtCoordinates(e.clientX, e.clientY);
				if (targetArea) {
					this.executeDropLogic(targetArea);
				} else {
					console.log("Dropped outside a valid area slot");
				}
			});
			
			// Prevent native context menus from interfering
			document.addEventListener('contextmenu', (e) => {
				if (e.target.classList.contains(this.#ringItemsClassName)) e.preventDefault();
			});
		});
	}
	
	updateVisualPosition(clientX, clientY)
	{
		if (!this.#dragVisualElement) return;
		this.#dragVisualElement.style.left = `${clientX - this.#dragVisualElement.offsetWidth / 2}px`;
		this.#dragVisualElement.style.top = `${clientY - this.#dragVisualElement.offsetHeight / 2}px`;
	}
	
	resizeGameViewport()
	{
		//Skip if not initialized
		if (!this.#scalerEl) return;
		//Calculate view multipliers
		const scaleX = window.innerWidth / this.#targetWidth;
		const scaleY = window.innerHeight / this.#targetHeight;
		//Calculate best scale
		let optimalScale = Math.min(scaleX, scaleY);
		//No scaling if already large enough
		if (optimalScale > 1) optimalScale = 1;
		//Scale element
		this.#scalerEl.style.transform = `scale(${optimalScale})`;
	}

	clearDragVisualElements()
	{
		document.querySelectorAll('#' + this.#dragVisualElementId).forEach(el => el.remove());
	}

	findTargetAreaAtCoordinates(clientX, clientY)
	{
		for (let area of document.querySelectorAll(this.#dropAreaTagName))
		{
			const map = area.parentElement;
			const linkedImg = document.querySelector(`img[usemap="#${map.name}"]`);
			if (!linkedImg) continue;
			
			const rect = linkedImg.getBoundingClientRect();
			const scaleX = rect.width / linkedImg.naturalWidth;
			const scaleY = rect.height / linkedImg.naturalHeight;
			const coords = area.coords.split(',').map(Number);
			
			if (area.shape === 'rect' || !area.shape)
			{
				const left = rect.left + (coords[0] * scaleX);
				const top = rect.top + (coords[1] * scaleY);
				const right = rect.left + (coords[2] * scaleX);
				const bottom = rect.top + (coords[3] * scaleY);
				if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) return area;
			}
			else if (area.shape === 'circle')
			{
				const centerX = rect.left + (coords[0] * scaleX);
				const centerY = rect.top + (coords[1] * scaleY);
				const radius = coords[2] * Math.min(scaleX, scaleY);
				const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));
				if (distance <= radius) return area;
			}
		}
		return null;
	}

	updateActiveHoverState(clientX, clientY)
	{
		document.querySelectorAll('.' + this.#ringHighlightClassName).forEach(box => box.classList.remove('is-hovered'));
		let targetArea = this.findTargetAreaAtCoordinates(clientX, clientY);
		if (targetArea)
		{
			const index = targetArea.getAttribute('data-area-index');
			const matchingOverlay = document.querySelector(`.${this.#ringHighlightClassName}[data-area-index="${index}"]`);
			if (matchingOverlay) matchingOverlay.classList.add('is-hovered');
		}
	}

	highlightDropAreas(showHighlight = false)
	{
		document.querySelectorAll('.' + this.#ringHighlightClassName).forEach(box => box.remove());
		if (!showHighlight) return;

		document.querySelectorAll(this.#dropAreaTagName).forEach((area, index) => {
			const map = area.parentElement;
			const linkedImg = document.querySelector(`img[usemap="#${map.name}"]`);
			if (!linkedImg) return;
			const handWrapper = linkedImg.closest('.hand-wrapper');
			if (!handWrapper) return;

			const coords = area.coords.split(',').map(Number);
			const overlay = document.createElement('div');
			overlay.classList.add(this.#ringHighlightClassName);
			overlay.setAttribute('data-area-index', index);
			area.setAttribute('data-area-index', index);

			overlay.style.position = 'absolute';
			overlay.style.pointerEvents = 'none';
			overlay.style.border = '2px dashed #ff0000';
			overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.15)';
			overlay.style.zIndex = '999';

			if (area.shape === 'circle') {
				overlay.style.borderRadius = '50%';
				overlay.style.width = `${coords[2] * 2}px`;
				overlay.style.height = `${coords[2] * 2}px`;
				overlay.style.left = `${coords[0] - coords[2]}px`;
				overlay.style.top = `${coords[1] - coords[2]}px`;
			} else {
				overlay.style.borderRadius = '4px';
				overlay.style.left = `${coords[0]}px`;
				overlay.style.top = `${coords[1]}px`;
				overlay.style.width = `${coords[2] - coords[0]}px`;
				overlay.style.height = `${coords[3] - coords[1]}px`;
			}
			handWrapper.appendChild(overlay);
		});
	}
	
	executeDropLogic(area) 
	{
		this.highlightDropAreas(false);
		this.clearDragVisualElements();
		const coords = area.coords.split(',').map(Number);
		
		let centerX = 0;
		let centerY = 0;
		if (area.shape === 'circle')
		{
			centerX = coords[0];
			centerY = coords[1];
		}
		else
		{
			// Correctly calculates midpoints for standard bounding box rectangles
			centerX = (coords[0] + coords[2]) / 2;
			centerY = (coords[1] + coords[3]) / 2;
		}
	
		// Use data-finger or fallback to item-type so bracelets target properly
		const fingerId = area.getAttribute('data-finger') || area.getAttribute('data-item-type');
		//console.log('fingerId/ItemId:', fingerId);
		
		const existingRing = document.getElementById(`placed-${fingerId}`);
		if (existingRing)
		{
			existingRing.remove();
		}
	
		const mapName = area.parentElement.getAttribute('name');
		const targetContainerId = mapName === 'left-hand-map' ? 'left-hand-container' : 'right-hand-container';
		const activeContainer = document.getElementById(targetContainerId);
		//console.log('activeContainer', targetContainerId);
		
		if (!activeContainer) return;
		
		let ringRotateAngle = '0deg';
		const isBracelet = area.getAttribute('data-item-type') == 'bracelet';
		const isRing = area.getAttribute('data-item-type') === 'ring';
		const isHeld = area.getAttribute('data-item-type') === 'held';
		const isThumb = fingerId.includes('thumb');
		
		// Custom positional/spatial offsets for different gear types
		if (fingerId === "right-thumb")
		{
			ringRotateAngle = '-40deg';
			centerX += 6;
			centerY -= 20;
		}
		else if (fingerId === "left-thumb")
		{
			ringRotateAngle = '40deg';
			centerX -= 20;
			centerY += 10;
		}
		
		const wrapper = document.createElement('div');
		//wrapper.dataset = this.#draggedRingDataset;
		//console.log(this.#draggedRingDataset)
		Object.assign(wrapper.dataset, this.#draggedRingDataset);
		
		//Add score popup element
		let scoreEl = document.createElement("div");
		scoreEl.classList.add("popup-score");
		wrapper.appendChild(scoreEl);
		
		wrapper.classList.add('ring-wrapper');
		wrapper.id = `placed-${fingerId}`;
		wrapper.style.position = 'absolute';
		wrapper.style.left = `${centerX}px`;
		wrapper.style.top = `${centerY}px`;
		wrapper.style.transform = 'translate(-50%, -50%)';
		wrapper.style.pointerEvents = 'none';
		wrapper.style.rotate = ringRotateAngle;
		
		// --- DYNAMIC BOUNDING BOX SIZING FROM MAP COORDS ---
		let targetWidth = 44;  // Safe defaults
		let targetHeight = 44;

		if (area.shape !== 'circle')
		{
			// Calculate exactly how big the target hit-box is
			const areaWidth = Math.abs(coords[2] - coords[0]);
			const areaHeight = Math.abs(coords[3] - coords[1]);
			
			if (isBracelet) 
			{
				targetWidth = areaWidth * 2; 
				targetHeight = areaHeight * 1.5;
			} 
			else if (isThumb)
			{
				targetWidth = 0.8 * areaWidth;
				targetHeight = 0.8 * areaWidth;
			}
			else {
				// Tight structural match to finger width (32px)
				targetWidth = areaWidth;
				targetHeight = areaWidth;
			}
		}

		wrapper.style.width = `${targetWidth}px`;
		wrapper.style.height = `${targetHeight}px`;
		wrapper.style.overflow = 'hidden'; 
		
		const ringImg = document.createElement('img');
		ringImg.className = 'placed-ring-graphic';
		ringImg.style.width = '100%';
		ringImg.style.height = '100%';
		ringImg.style.display = 'block';
		
		//Update style of img when dropped based on type
		if (isBracelet) 
		{
			ringImg.style.clipPath = 'inset(47% 0% 0% 0%)'; 
			ringImg.style.transform = 'translateY(-40%) scale(3)'; 
		}
		else if (isRing)
		{
			ringImg.style.clipPath = 'inset(0% 0% 45% 0%)'; 
			ringImg.style.transform = 'translateY(22%)'; 
		}else if(isHeld)
		{
			//Assume held items face right (correct for the left hand)
			if(fingerId.includes('right'))
			{
				//Mirror horizontal
				ringImg.style.transform = 'translateY(0%) scale(2) rotateY(180deg)';
			}
			else
			{
				ringImg.style.transform = 'translateY(0%) scale(2)';
			}
		}
		
		// --- BLOB STREAM GENERATOR ---
		try
		{
			let rawStr = this.#draggedRingSrc;
			let cleanSvgText = '';

			if (rawStr.startsWith('data:image/svg+xml,%3C'))
			{
				//URL-encoded SVG
				const content = rawStr.replace(/^data:image\/svg\+xml,/, '');
				cleanSvgText = decodeURIComponent(content);
				const blob = new Blob([cleanSvgText], { type: 'image/svg+xml' });
				ringImg.src = URL.createObjectURL(blob);
				ringImg.onload = () => URL.revokeObjectURL(ringImg.src);
			}
			else if(rawStr.startsWith('data:image'))
			{
				//Raw SVG
				const content = rawStr.replace(/^data:image\/svg\+xml;utf8,/, '');
				cleanSvgText = decodeURIComponent(content);
				const blob = new Blob([cleanSvgText], { type: 'image/svg+xml' });
				ringImg.src = URL.createObjectURL(blob);
				ringImg.onload = () => URL.revokeObjectURL(ringImg.src);
			}
			else
			{
				//Img Path
				ringImg.src = rawStr;
			}
		
		}
		catch (e) 
		{
			console.warn("Blob pipeline failed, shifting to fallback data string parsing:", e);
			ringImg.src = this.#draggedRingSrc;
		}

		wrapper.appendChild(ringImg);
		activeContainer.appendChild(wrapper);
	}
}

// Clean utility helper to delay execution in loop frames
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class RingScoring 
{
	//Element references
	#physicalAttackBtnEl = null;
	#magicalAttackBtnEl = null;
	#clearHandsBtnEl = null;
	
	constructor()
	{
		this.initTestButtons();
	}
	
	initTestButtons = () => 
	{
		this.#physicalAttackBtnEl = document.getElementById("btnTestPhysicalAttack");
		if (this.#physicalAttackBtnEl)
		{
			this.#physicalAttackBtnEl.addEventListener("click", (ev) =>
			{
				this.triggerPhysicalAttack();
			});
		}
		
		this.#magicalAttackBtnEl = document.getElementById("btnTestMagicalAttack");
		
		this.#clearHandsBtnEl = document.getElementById("btnClearHands");
		if (this.#clearHandsBtnEl)
		{
			this.#clearHandsBtnEl.addEventListener("click", () =>
			{
				//this.clearTxt();
				this.clearHands();
			});
		}
	}
	
	triggerPhysicalAttack = async () => 
	{
		// Clear old text first so you can clearly see the new calculations run step-by-step
		this.clearTxt();
		console.log('--- Starting Physical Attack Scoring Cycle ---');
		this.outputToTxt("physical attack");
		this.resetScores();
		
		// --- EXACT ANATOMICAL SCORING ORDER MATRIX ---
		const targetOrderIDs = [
			//HELD ITEMS TRIGGER FIRST
			"placed-held-left",
			"placed-held-right",
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
			//THEN WRIST ITEMS (BRACELETS)
			"placed-left-wrist",
			"placed-right-wrist",
			//THEN TATTOOS (IF ANY)
			"placed-left-tattoo",
			"placed-right-tattoo"
		];
		
		let scoringItems = [];
		
		// Scan through the exact order tracking index matrix
		targetOrderIDs.forEach(id =>
		{
			const foundRingElement = document.getElementById(id);
			if (foundRingElement) {
				scoringItems.push(foundRingElement);
			}
		});
		
		console.log('Aggregated active items sorted in exact order:', scoringItems.map(r => r.id));

		let damage = new Damage();
		damage.base = 10;
		damage.power = 1;
		
		for(let i = 0; i < scoringItems.length; i++)
		{
			let scoringItem = scoringItems[i];
			
			// Target Debugging Lookups
			console.log(`Inspecting element [Index: ${i}, ID: ${scoringItem.id}]:`, scoringItem.dataset);
			
			let rarityMultiplier = Number(scoringItem.dataset.rarityMultiplier || 1);
			let effectValue = Number(scoringItem.dataset.effectValue || 0);
			let effectName = scoringItem.dataset.effectName;
			let effectOp = scoringItem.dataset.effectOperation;
			
			let scoringTypes = ["base", "power"];
			let scoreContribution = 0;
			let ringScores = false;
			
			if(scoringTypes.includes(effectName))
			{
				console.log(`Matched valid scoring type "${effectName}" for item ${scoringItem.id}. Value: ${effectValue}, Multiplier: ${rarityMultiplier}`);
				this.outputToTxt("Scoring possible for " + effectName + " for value = " + effectValue + ", rarity = " + rarityMultiplier);
				
				switch(effectOp)
				{
					case "add":
						ringScores = true;
						scoreContribution = (effectValue * rarityMultiplier); 
						damage[effectName] += scoreContribution;
						console.log(`Operation [ADD]: Contribution calculated as ${scoreContribution}. New damage.${effectName} running total = ${damage[effectName]}`);
					break;
					case "multiply":
						ringScores = true;
						scoreContribution = (effectValue * rarityMultiplier);
						damage[effectName] *= scoreContribution;
						console.log(`Operation [MULTIPLY]: Contribution calculated as ${scoreContribution}. New damage.${effectName} running total = ${damage[effectName]}`);
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
				console.log(`Triggering visual score animation for ${scoringItem.id}`);
				this.scoreRing(scoringItem);
				
				// This holds the loop frame open for 500ms so you can view the changes update incrementally
				await sleep(500);
			}
		}
		
		// Calculate final total damage numbers
		damage.total = damage.base * damage.power;
		console.log('Calculation Step Complete. Final Stats Computed:', damage);
		
		// Update visual layouts to display total sum metrics
		this.updateTotalScore(damage.total);
	
		this.outputToTxt("Final Base = " + damage.base);
		this.outputToTxt("Final Power = " + damage.power);
		this.outputToTxt("Total Damage = " + damage.total);
		
		// Allow 1s for final total text to be read/animated before cleaning up components
		console.log('All updates pushed to DOM view layers. Pausing execution before clearing temporary overlay popups...');
		await sleep(1000);
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
		let scoringTypes = ["base", "power"];
		let scoreContribution = 0;
		let popupString = "";
		
		if (scoringTypes.includes(effectName))
		{
		switch (effectOp)
			{
				case "add":
					scoreContribution = (effectValue * rarityMultiplier);
					popupString = "+" + scoreContribution;
					if (effectName === "base") this.addBaseScore(scoreContribution);
					if (effectName === "power") this.addPowerScore(scoreContribution);
				break;
				case "multiply":
					scoreContribution = (effectValue * rarityMultiplier);
					popupString = "x" + scoreContribution;
					if (effectName === "base") this.multiplyBaseScore(scoreContribution);
					if (effectName === "power") this.multiplyPowerScore(scoreContribution);
				break;
			}
		}
		
		if (popupString !== "")
		{
			console.log(`Setting Popup markup contents for ${scoringItem.id} to "${popupString}"`);
			popupEl.innerHTML = popupString;
			popupEl.style.backgroundColor = effectName === "base" ? "var(--base-score-color)" : "var(--power-score-color)";
			popupEl.classList.add("show");
		}
	}

	addBaseScore = (base) =>
	{
		let previous = parseInt(document.getElementById("baseScore").innerHTML) || 0;
		base = previous + base;
		document.getElementById("baseScore").innerHTML = base;
	}

	multiplyBaseScore = (multiplier) =>
	{
		let previous = parseInt(document.getElementById("baseScore").innerHTML) || 0;
		let newBase = previous * multiplier;
		document.getElementById("baseScore").innerHTML = newBase;
	}

	addPowerScore = (power) => 
	{
		let previous = parseInt(document.getElementById("powerScore").innerHTML) || 0;
		power = previous + power;
		document.getElementById("powerScore").innerHTML = power;
	}

	multiplyPowerScore = (multiplier) =>
	{
		let previous = parseInt(document.getElementById("powerScore").innerHTML) || 0;
		let newPower = previous * multiplier;
		document.getElementById("powerScore").innerHTML = newPower;
	}

	updateTotalScore = (total) => 
	{
		let previous = parseInt(document.getElementById("totalScore").innerHTML) || 0;
		total = previous + total;
		document.getElementById("totalScore").innerHTML = total;
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

	scoreDamage = (damage, ring) => 
	{
		// Placeholder method preserved from original code hook
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

// Automatically instantiate the application scope
let ringUi = new RingMapUi();
let ringScoring = new RingScoring();