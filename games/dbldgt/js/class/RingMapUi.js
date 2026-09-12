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
	//#targetWidth = 480;
	//#targetHeight = 400;
	#inventoryTypes = ['ring', 'bracelet', 'held', 'tattoo'];
	//SET CLASS NAMES / TAGS / IDs
	#ringItemsClassName = 'item';
	#dragVisualElementId = 'drag-visual';
	#dropAreaTagName = 'area';
	#ringHighlightClassName = 'ring-highlight-overlay';
	#gameScalerId = 'game-scaler';
	#handsSectionElementId = 'hands-section';
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
			
			passDataToLayout(this.#itemData);
			
			//Generate hands
			//this.generateHands();
			
			//Generate items
			//this.generateItems();
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
		this.initEvents();
		this.resizeGameViewport(); // Run an initial setup execution immediately
	}
	
	generateHands()
	{
	  	//Generate hands and hand maps
			for(let i = 0; i < this.#itemData.hands.length; i++)
			{
				//Get hand data
				let hand = this.#itemData.hands[i];
				
				//Output hand wrapper div
				let handWrapperDiv = document.createElement('div');
				handWrapperDiv.className = 'hand-wrapper';
				handWrapperDiv.id = hand.name + '-hand-container';
				
				//Output img
				let handImg = document.createElement('img');
				handImg.src = hand.src;
				handImg.alt = hand.alt;
				handImg.useMap = '#' + hand.usemap;
				handImg.className = hand.class;
				handWrapperDiv.appendChild(handImg);
				
				//Output map
				let handMap = document.createElement('map');
				handMap.name = hand.usemap;
				
				//Output areas
				for(let a = 0; a < hand.areas.length; a++)
				{
					let areaData = hand.areas[a];
					let area = document.createElement('area');
					area.shape = areaData.shape;
					area.coords = areaData.coords;
					area.alt = areaData.alt;
					area.dataset.finger = areaData.finger;
					area.dataset.itemType = areaData.itemType;
					handMap.appendChild(area);
				}
				
				handWrapperDiv.appendChild(handMap);
				document.getElementById(this.#handsSectionElementId).appendChild(handWrapperDiv);
			}
	}
	
	generateItems()
	{
	  //Generate example item data
			let itemInfo = this.#itemData.items.rings;
			
			//Create inventory sections
			for(let i = 0; i < this.#inventoryTypes.length; i++)
			{
				let typeName = this.#inventoryTypes[i];
				//Skip type if not found
				if(itemInfo.filter(r => { return r.type === typeName; }).length < 1) continue;
				let inventorySection = document.createElement('section');
				inventorySection.id = 'inventory-' + typeName;
				let inventorySectionHeading = document.createElement('h4');
				inventorySectionHeading.innerHTML = typeName.toUpperCase();
				inventorySection.appendChild(inventorySectionHeading);
				let itemWrapContainer = document.createElement('div');
				itemWrapContainer.className = 'item-wrapper-container';
				itemWrapContainer.id = 'inventory-wrapper-' + typeName;
				inventorySection.appendChild(itemWrapContainer);
				this.#ringOptionsAreaEl.appendChild(inventorySection);
			}
			
			itemInfo.forEach(r => 
			{
				let itemWrapper = document.createElement("div");
				itemWrapper.classList.add("item-wrapper");
				
				let itemImg = document.createElement('img');
				itemImg.src = r.icon;
				//ringImg.className = this.#ringItemsClassName;
				//Add class '.item'
				itemImg.classList.add('item');
				//Add class '.ring'/'.bracelet' etc
				itemImg.classList.add(r.type);
				itemImg.dataset.itemType = r.type;
				itemImg.draggable = true;
				itemImg.id = r.id;
				itemImg.alt = r.name;
				itemImg.title = r.name;
				itemImg.dataset.rarityName = r.rarity.name;
				itemImg.dataset.rarityMultiplier = r.rarity.multiplier;
				itemImg.dataset.effectValue = r.effect.value;
				itemImg.dataset.effectName = r.effect.name;
				itemImg.dataset.effectOperation = r.effect.operation;
				itemImg.dataset.description = r.name + "<br><br>" + r.effect.description;
				let scoreEl = document.createElement("div");
				scoreEl.classList.add("popup-score");
				itemWrapper.appendChild(scoreEl);
				itemWrapper.appendChild(itemImg);
				
				document.getElementById('inventory-wrapper-' + r.type).appendChild(itemWrapper);
			});
	}
	
	//===================
	// EVENTS
	//===================

	initEvents()
	{
		//APPLY DRAG EVENTS FOR EACH RING
		document.querySelectorAll('.' + this.#ringItemsClassName)
		.forEach(ring => 
		{
			// --- UNIFIED POINTER DOWN (Mouse & Touch) ---
			ring.addEventListener('pointerdown', (e) => 
			{
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
			
			ring.addEventListener('pointerover', (e) => 
			{
				// Specifically target the score element inside this ring
				let popupEl = ring.parentElement.querySelector(".popup-score");
				
				if (popupEl)
				{
					popupEl.innerHTML = ring.dataset.description || "";
					popupEl.style.backgroundColor = "var(--total-score-color)";
					popupEl.classList.add("show");
					
					//console.log('Showing', popupEl.innerHTML);
					
					setTimeout(() => this.clearPopup(popupEl), 5000);
				}
			});
		
			// --- UNIFIED POINTER MOVE ---
			ring.addEventListener('pointermove', (e) => 
			{
				if (!this.#isDragging || !this.#dragVisualElement) return;
				this.updateVisualPosition(e.clientX, e.clientY);
				this.updateActiveHoverState(e.clientX, e.clientY);
			});
		
			// --- UNIFIED POINTER UP / RELEASE ---
			ring.addEventListener('pointerup', (e) => 
			{
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
	
	clearPopup(el)
	{
		el.classList.remove("show");
	}
	
	updateVisualPosition(clientX, clientY)
	{
		if (!this.#dragVisualElement) return;
		this.#dragVisualElement.style.left = `${clientX - this.#dragVisualElement.offsetWidth / 2}px`;
		this.#dragVisualElement.style.top = `${clientY - this.#dragVisualElement.offsetHeight / 2}px`;
	}
	
	resizeGameViewport()
	{
		//Set game scaler elemnent
		this.#scalerEl = document.getElementById(this.#gameScalerId);
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

		//Check that the dropped item matches the container it is being dropped into 
		let areaType = area.getAttribute('data-item-type');
		let dropType = this.#draggedRingDataset.itemType;
		if(areaType !== dropType)
		{
			console.log("Drop mismatch - tried to drop " + dropType + " into " + areaType + " slot. Aborting placement.");
			return;
		} 
		
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

		/*
		//Add event listener to remove item if touched (not working)
		ringImg.addEventListener('pointerdown', (e) => 
		{
		  console.log('Removing', wrapper);
		  document.removeChild(wrapper);
		});
		*/
		  
		wrapper.appendChild(ringImg);
		activeContainer.appendChild(wrapper);
	}
	
	getItems(maxRarity = 0, count = 0)
	{
		let items = [];
		let allItems = [
			...this.#itemData.items.ring, 
			...this.#itemData.items.bracelet,
			...this.#itemData.items.held,
			...this.#itemData.items.tattoo
		];
		allItems = allItems.filter((i) => { return i.rarity.multiplier <= maxRarity;});
		//console.log(allItems);
		if(allItems.length == count) return allItems;
		for(let i = 0; i < count; i++)
		{
			let item = allItems[Math.floor(Math.random() * allItems.length)];
			items.push(item);
		}
	}
}