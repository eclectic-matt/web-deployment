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
    if (this.#ringOptionsAreaEl) {
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
        ringImg.dataset.effectOp = r.effect.operation;

        if (this.#ringOptionsAreaEl)
        {
          this.#ringOptionsAreaEl.appendChild(ringImg);
        }
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
      //==================
      // DRAG START 
      //==================
  
      // --- DESKTOP LOGIC ---
      ring.addEventListener('dragstart', (e) => 
      {
        const imgElement = e.currentTarget.tagName === 'IMG' 
          ? e.currentTarget 
          : e.currentTarget.querySelector('img');
  
        if (imgElement)
        {
          this.#isDragging = true;
          this.#draggedRingSrc = imgElement.src;
          e.dataTransfer.setData('text/plain', imgElement.src);
          this.#draggedRingDataset = imgElement.dataset;
          this.highlightDropAreas(true);
        }
      });
  
      // --- MOBILE FALLBACK INITIALIZATION ---
      ring.addEventListener('pointerdown', (e) => 
      {
        const imgElement = e.currentTarget.tagName === 'IMG' 
          ? e.currentTarget 
          : e.currentTarget.querySelector('img');
  
        if (imgElement)
        {
          this.#isDragging = true;
          this.#draggedRingSrc = imgElement.src;
          this.#draggedRingDataset = imgElement.dataset;
          this.highlightDropAreas(true);
  
          // Capture pointer focus to ensure movement tracking continues if finger slips
          ring.setPointerCapture(e.pointerId);
          this.clearDragVisualElements();
          // Create the visual proxy element immediately on down action
          this.#dragVisualElement = document.createElement('img');
          this.#dragVisualElement.id = this.#dragVisualElementId;
          this.#dragVisualElement.src = this.#draggedRingSrc; // FIX: Prefixed with 'this.'
          this.#dragVisualElement.style.position = 'fixed'; // Fixed positioning scales better across layouts
          this.#dragVisualElement.style.width = `${imgElement.offsetWidth}px`;
          this.#dragVisualElement.style.height = `${imgElement.offsetHeight}px`;
          this.#dragVisualElement.style.pointerEvents = 'none'; // Critical: allows dropping beneath itself
          this.#dragVisualElement.style.zIndex = '9999';
          this.updateVisualPosition(e.clientX, e.clientY);
          document.body.appendChild(this.#dragVisualElement);
        }
      });
  
      //==================
      // DRAG END (DROP) 
      //==================
  
      // --- DESKTOP NATIVE CLEANUP ---
      ring.addEventListener('dragend', () => 
      {
        this.#isDragging = false;
        this.highlightDropAreas(false);
        
        // Clean up any proxy images abandoned by pointerdown
        if (this.#dragVisualElement)
        {
          this.#dragVisualElement.remove();
          this.#dragVisualElement = null;
        }
      });
  
      // --- MOBILE RELEASE LOGIC ---
      ring.addEventListener('pointerup', (e) => 
      {
        if (!this.#isDragging) return;
        this.highlightDropAreas(false);
        this.#isDragging = false;
        if (e.pointerId === undefined)
        {
          if (this.#dragVisualElement) {
            this.#dragVisualElement.remove();
            this.#dragVisualElement = null;
          }
          return;
        }
        ring.releasePointerCapture(e.pointerId);
        
        if (this.#dragVisualElement)
        {
          this.#dragVisualElement.remove();
          this.#dragVisualElement = null;
        }
        
        //Get dropped item type
        let droppedItemType = ring.dataset.itemType;
        
        const fingerX = e.clientX;
        const fingerY = e.clientY;
        
        let targetArea = null;
        
        for (let area of document.querySelectorAll(this.#dropAreaTagName)) {
          const map = area.parentElement;
          const linkedImg = document.querySelector(`img[usemap="#${map.name}"]`);
          
          if (!linkedImg) continue;
          
          const rect = linkedImg.getBoundingClientRect();
          
          // Calculate the responsive layout scaling ratios
          const scaleX = rect.width / linkedImg.naturalWidth;
          const scaleY = rect.height / linkedImg.naturalHeight;
          
          const coords = area.coords.split(',').map(Number);
          
          if (area.shape === 'rect' || !area.shape)
          {
            // Apply scale ratios directly to HTML coordinates
            const left = rect.left + (coords[0] * scaleX);
            const top = rect.top + (coords[1] * scaleY);
            const right = rect.left + (coords[2] * scaleX);
            const bottom = rect.top + (coords[3] * scaleY);
            
            if (fingerX >= left && fingerX <= right && fingerY >= top && fingerY <= bottom)
            {
              targetArea = area;
              break;
            }
          }
          else if (area.shape === 'circle')
          {
            // Apply scale ratios to the center coordinates and radius length
            const centerX = rect.left + (coords[0] * scaleX);
            const centerY = rect.top + (coords[1] * scaleY);
            const radius = coords[2] * scaleX; // Assumes proportional uniform scaling
            
            const distance = Math.sqrt(Math.pow(fingerX - centerX, 2) + Math.pow(fingerY - centerY, 2));
            if (distance <= radius) {
              targetArea = area;
              break;
            }
          }
        }
        
        if (targetArea) 
        {
          let dropAreaType = targetArea.dataset.itemType;
          //console.log('dropAreaType', dropAreaType);
          //console.log('droppedItemType', droppedItemType);
          if(dropAreaType === droppedItemType)
          {
            this.executeDropLogic(targetArea);
          }
          else
          {
            //console.log('Tried to drop a', droppedItemType,'onto a',dropAreaType,'slot!');
          }
        }
        else
        {
          //console.log("Dropped outside a valid area slot");
        }
        this.clearDragVisualElements();
      });
  
      //==================
      // DRAG MOVE 
      //==================
  
      // --- DESKTOP EVENT ---
      ring.addEventListener('drag', (e) => { // Updated from custom non-standard 'dragmove' to native 'drag'
        if (!this.#isDragging || e.clientX === 0) return;
        this.updateVisualPosition(e.clientX, e.clientY);
        this.updateActiveHoverState(e.clientX, e.clientY);
      });
  
      // --- MOBILE EVENT TRACKING ---
      ring.addEventListener('pointermove', (e) => {
        if (!this.#isDragging || !this.#dragVisualElement) return;
        this.updateVisualPosition(e.clientX, e.clientY);
        
        // Tracks hover positions on mobile layout views in real-time
        this.updateActiveHoverState(e.clientX, e.clientY);
      });
  
      // Prevent context menu interactions blocking dragging
      ring.addEventListener('contextmenu', (e) => e.preventDefault());
    });
  }
  
  updateVisualPosition(clientX, clientY)
  {
    if (!this.#dragVisualElement) return;
    // Align the center of the elements tracking graphic directly to the mouse cursor position
    const offsetX = this.#dragVisualElement.offsetWidth / 2;
    const offsetY = this.#dragVisualElement.offsetHeight / 2;
    this.#dragVisualElement.style.left = `${clientX - offsetX}px`;
    this.#dragVisualElement.style.top = `${clientY - offsetY}px`;
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
    this.#visualEls = document.querySelectorAll('#' + this.#dragVisualElementId);
    this.#visualEls.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }
  
  highlightDropAreas(showHighlight = false)
  {
    //Clear out previous highlight elements
    document.querySelectorAll('.' + this.#ringHighlightClassName).forEach(box => box.remove());
    if (!showHighlight) return;

    // Grab your scaling container element
    if (!this.#scalerEl) return;

    document.querySelectorAll(this.#dropAreaTagName).forEach((area, index) => {
      const map = area.parentElement;
      const linkedImg = document.querySelector(`img[usemap="#${map.name}"]`);
      if (!linkedImg) return;

      // Find the parent hand-wrapper element
      const handWrapper = linkedImg.closest('.hand-wrapper');
      if (!handWrapper) return;

      const coords = area.coords.split(',').map(Number);

      const overlay = document.createElement('div');
      overlay.classList.add(this.#ringHighlightClassName); 
      
      overlay.setAttribute('data-area-index', index);
      area.setAttribute('data-area-index', index);

      // Layout positions relative to the container frame
      overlay.style.position = 'absolute';
      overlay.style.pointerEvents = 'none'; 
      overlay.style.border = '2px dashed #ff0000';
      overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.15)'; 
      overlay.style.zIndex = '999';

      if (area.shape === 'circle')
      {
        const centerX = coords[0];
        const centerY = coords[1];
        const radius = coords[2];

        overlay.style.borderRadius = '50%'; 
        overlay.style.width = `${radius * 2}px`;
        overlay.style.height = `${radius * 2}px`;
        overlay.style.left = `${centerX - radius}px`;
        overlay.style.top = `${centerY - radius}px`;
      }
      else if (area.shape === 'rect' || !area.shape)
      {
        overlay.style.borderRadius = '4px'; 
        overlay.style.left = `${coords[0]}px`;
        overlay.style.top = `${coords[1]}px`;
        overlay.style.width = `${coords[2] - coords[0]}px`;
        overlay.style.height = `${coords[3] - coords[1]}px`;
      }

      //Append to unscaled parent container
      handWrapper.appendChild(overlay);
    });
  }
  
  updateActiveHoverState(clientX, clientY)
  {
    //Remove hover class from active overlays
    document.querySelectorAll('.' + this.#ringHighlightClassName).forEach(box => box.classList.remove('is-hovered'));
    
    //Get scaling factor from game scaler
    let currentScale = 1;
    if (this.#scalerEl && this.#scalerEl.style.transform)
    {
      // Extracts the numerical value out of "scale(0.75)"
      const match = this.#scalerEl.style.transform.match(/scale\(([^)]+)\)/);
      if (match && match[1])
      {
        currentScale = parseFloat(match[1]);
      }
    }
    
    //Scan bounds to see if coords sit inside any finger zone
    for (let area of document.querySelectorAll(this.#dropAreaTagName)) {
      const map = area.parentElement;
      const linkedImg = document.querySelector(`img[usemap="#${map.name}"]`);
      if (!linkedImg) continue;
      
      const rect = linkedImg.getBoundingClientRect();
      const coords = area.coords.split(',').map(Number);
      let isInside = false;
      
      if (area.shape === 'circle')
      {
        // Apply scale multiplier directly to your area map coordinates parameters
        const centerX = rect.left + (coords[0] * currentScale);
        const centerY = rect.top + (coords[1] * currentScale);
        const radius = coords[2] * currentScale;
        
        const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));
        if (distance <= radius) isInside = true;
      }
      else if (area.shape === 'rect' || !area.shape)
      {
        // Apply scale multiplier directly to your area map coordinates parameters
        const left = rect.left + (coords[0] * currentScale);
        const top = rect.top + (coords[1] * currentScale);
        const right = rect.left + (coords[2] * currentScale);
        const bottom = rect.top + (coords[3] * currentScale);
        
        if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) isInside = true;
      }
      
      if (isInside)
      {
        const index = area.getAttribute('data-area-index');
        const matchingOverlay = document.querySelector(`.` + this.#ringHighlightClassName + `[data-area-index="${index}"]`);
        if (matchingOverlay)
        {
          matchingOverlay.classList.add('is-hovered');
        }
        break;
      }
    }
  }
  
  executeDropLogic(area) 
  {
    this.highlightDropAreas(false);
    this.clearDragVisualElements();
    const coords = area.coords.split(',').map(Number);
    
    let centerX = 0;
    let centerY = 0;
    if (area.shape === 'circle') {
      centerX = coords[0];
      centerY = coords[1];
    } else {
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
    const isBracelet = fingerId.includes('bracelet');
    const isRing = area.getAttribute('data-item-type') == 'ring';
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

    if (area.shape !== 'circle') {
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
    
    if (isBracelet) 
    {
      ringImg.style.clipPath = 'inset(47% 0% 0% 0%)'; 
      ringImg.style.transform = 'translateY(-40%) scale(3)'; 
    }
    else if (isRing)
    {
      ringImg.style.clipPath = 'inset(0% 0% 45% 0%)'; 
      ringImg.style.transform = 'translateY(22%)'; 
    }
    
    // --- BLOB STREAM GENERATOR ---
    try {
      let rawStr = this.#draggedRingSrc;
      let cleanSvgText = '';

      if (rawStr.startsWith('data:image/svg+xml,%3C')) {
        const content = rawStr.replace(/^data:image\/svg\+xml,/, '');
        cleanSvgText = decodeURIComponent(content);
      } else {
        const content = rawStr.replace(/^data:image\/svg\+xml;utf8,/, '');
        cleanSvgText = decodeURIComponent(content);
      }

      const blob = new Blob([cleanSvgText], { type: 'image/svg+xml' });
      ringImg.src = URL.createObjectURL(blob);
      ringImg.onload = () => URL.revokeObjectURL(ringImg.src);
      
    } catch (e) {
      console.warn("Blob pipeline failed, shifting to fallback data string parsing:", e);
      ringImg.src = this.#draggedRingSrc;
    }

    wrapper.appendChild(ringImg);
    activeContainer.appendChild(wrapper);
  }

}


class RingScoring 
{
  constructor()
  {
    this.initTestButtons();
  }
  
  initTestButtons = () => 
  {
  	let physBtn = document.getElementById("btnTestPhysicalAttack");
  	physBtn.addEventListener("click", (ev) =>
  	{
  		this.triggerPhysicalAttack();
  	});
  	let magicBtn = document.getElementById("btnTestMagicalAttack");
  	let clearBtn = document.getElementById("btnClearTxt");
  	clearBtn.addEventListener("click", () => 
  	{
  		this.clearTxt().bind(this);
  	});
  }
  
  triggerPhysicalAttack = () => 
  {
  	outputToTxt("physical attack");
  	//Reset scores
  	this.resetScores();
  	//Get ring data
  	//let rings = document.querySelectorAll(".ring");
  	let rings = [];
  	//Correct approach - get left hand, then each ring on that hand in order
  	let lhRings = document.querySelectorAll("#left-hand-container > .ring-wrapper");
  	//console.log('lhRings', lhRings);
  	rings.push(...lhRings);
  	let rhRings = document.querySelectorAll("#right-hand-container > .ring-wrapper");
  	rings.push(...rhRings);
  	//console.log('rhRings', rhRings);
  	//console.log('rings', rings);
  	let damage = new Damage();
  	damage.base = 10;
  	damage.power = 1;
  	let delay = 0;
  	for(let i = 0; i < rings.length; i++)
  	{
  		let ring = rings[i];
  		//console.log(ring.dataset);
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
  			//Calculate score contribution based on operation
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
  		if(ringScores)
  		{
  			//Display popups with 0.5s delay
  			setTimeout(this.scoreRing, delay, ring);
  			//Add 500ms to delay
  			delay += 500;
  		}
  	}
  	
  	//Calculate total damage
  	damage.total = damage.base * damage.power;
  	//Update total score
  	setTimeout(updateTotalScore, delay, damage.total);
  
  	outputToTxt("Final Base = " + damage.base);
  	outputToTxt("Final Power = " + damage.power);
  	outputToTxt("Total Damage = " + damage.total);
  	//Add 1s to delay to allow popups to finish animating
  	delay += 1000;
  	//Clear popups classes for next scoring
  	setTimeout(clearPopups, delay);
  }
  
  resetScores = () =>
  {
    document.getElementById("baseScore").innerHTML = 10;
    document.getElementById("powerScore").innerHTML = 1;
    document.getElementById("totalScore").innerHTML = 0;
  }
  
  scoreRing = (ring) =>
  {
    let popupEl = ring.firstElementChild;
    console.log('scoring', ring, popupEl);
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
      //Calculate score contribution based on operation
      switch (effectOp)
      {
        case "add":
          scoreContribution = (effectValue * rarityMultiplier);
          popupString = "+" + scoreContribution;
          switch (effectName)
          {
            case "base":
              addBaseScore(scoreContribution);
              break;
            case "power":
              addPowerScore(scoreContribution);
              break;
          }
          break;
        case "multiply":
          scoreContribution = (effectValue * rarityMultiplier);
          popupString = "x" + scoreContribution;
          switch (effectName)
          {
            case "base":
              multiplyBaseScore(scoreContribution);
              break;
            case "power":
              multiplyPowerScore(scoreContribution);
              break;
          }
          break;
      }
    }
    
    if (popupString !== "")
    {
      //Show the popup element
      popupEl.innerHTML = popupString;
      switch (effectName) {
        case "base":
          popupEl.style.backgroundColor = "var(--base-score-color)";
          break;
        case "power":
          popupEl.style.backgroundColor = "var(--power-score-color)";
          break;
      }
      popupEl.classList.add("show");
    }
  }
  
}


const addBaseScore = (base) =>
{
	let previous = parseInt(document.getElementById("baseScore").innerHTML);
	base = previous + base;
	document.getElementById("baseScore").innerHTML = base;
}
const multiplyBaseScore = (multiplier) =>
{
	let previous = parseInt(document.getElementById("baseScore").innerHTML);
	let newBase = previous * multiplier;
	document.getElementById("baseScore").innerHTML = newBase;
}

const addPowerScore = (power) => 
{
	let previous = parseInt(document.getElementById("powerScore").innerHTML);
	power = previous + power;
	document.getElementById("powerScore").innerHTML = power;
}
const multiplyPowerScore = (multiplier) =>
{
	let previous = parseInt(document.getElementById("powerScore").innerHTML);
	let newPower = previous * multiplier;
	document.getElementById("powerScore").innerHTML = newPower;
}

const updateTotalScore = (total) => 
{
	let previous = parseInt(document.getElementById("totalScore").innerHTML);
	total = previous + total;
	document.getElementById("totalScore").innerHTML = total;
}

const clearPopups = () => 
{
	let rings = document.querySelectorAll(".ring-wrapper");
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

const scoreDamage = (damage, ring) => 
{
	
}

const outputToTxt = (msg) => 
{
	document.getElementById("txtTestOutput").value += msg + "\n";
}

const clearTxt = () => 
{
	document.getElementById("txtTestOutput").value = "";
}

// Automatically instantiate the application scope
let ringUi = new RingMapUi();
let ringScoring = new RingScoring();