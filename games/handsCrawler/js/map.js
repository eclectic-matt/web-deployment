class RingMapUi
{
  //INIT MAIN VARS
  #draggedRingSrc = null;
  #dragVisualElement = null;
  #itemData = null;
  #isDragging = false;
  //The hands element target dimensions
  #targetWidth = 540;
  #targetHeight = 420;
  //SET CLASS NAMES / TAGS / IDs
  #ringItemsClassName = 'ring-item';
  #dragVisualElementId = 'dragVisual';
  #dropAreaTagName = 'area';
  #highlightClassName = 'area-highlight-overlay';
  #gameScalerId = 'gameScaler';
  #ringOptionsElementId = 'ring-options';
  //THE JSON DATA PATH
  //#itemDataJsonPath = '../data/itemData.json';
  #itemDataJsonPath = '/games/handsCrawler/data/itemData.json';
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
      console.log(this.#itemDataJsonPath);
      
      const response = await fetch(this.#itemDataJsonPath);
      
      if (!response.ok)
      {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      this.#itemData = await response.json();
      let ringsInfo = this.#itemData.items.rings;
      
      ringsInfo.forEach(r => {
        let ringImg = document.createElement('img');
        ringImg.src = r.icon;
        ringImg.className = this.#ringItemsClassName;
        ringImg.draggable = true;
        ringImg.id = r.id;
        ringImg.alt = r.name;
        ringImg.title = r.name; // Fixed tooltip assignment using standard title attribute
        
        if (this.#ringOptionsAreaEl) {
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
    .forEach(ring => {
  
      //==================
      // DRAG START 
      //==================
  
      // --- DESKTOP LOGIC ---
      ring.addEventListener('dragstart', (e) => {
        const imgElement = e.currentTarget.tagName === 'IMG' 
          ? e.currentTarget 
          : e.currentTarget.querySelector('img');
  
        if (imgElement)
        {
          this.#isDragging = true;
          this.#draggedRingSrc = imgElement.src;
          e.dataTransfer.setData('text/plain', imgElement.src);
          this.highlightDropAreas(true);
        }
      });
  
      // --- MOBILE FALLBACK INITIALIZATION ---
      ring.addEventListener('pointerdown', (e) => {
        const imgElement = e.currentTarget.tagName === 'IMG' 
          ? e.currentTarget 
          : e.currentTarget.querySelector('img');
  
        if (imgElement)
        {
          this.#isDragging = true;
          this.#draggedRingSrc = imgElement.src;
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
      ring.addEventListener('dragend', () => {
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
      ring.addEventListener('pointerup', (e) => {
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
        
        if (targetArea) {
          this.executeDropLogic(targetArea);
        } else {
          console.log("Dropped outside a valid finger area slot");
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
    document.querySelectorAll('.' + this.#highlightClassName).forEach(box => box.remove());
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
      overlay.classList.add(this.#highlightClassName); 
      
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
    document.querySelectorAll('.' + this.#highlightClassName).forEach(box => box.classList.remove('is-hovered'));
    
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
        const matchingOverlay = document.querySelector(`.` + this.#highlightClassName + `[data-area-index="${index}"]`);
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
    
    // Calculate accurate spatial target mapping points based on shape variations
    let centerX = 0;
    let centerY = 0;
    if (area.shape === 'circle') {
      centerX = coords[0];
      centerY = coords[1];
    } else {
      centerX = (coords[0] + coords[2]) / 2;
      centerY = (coords[1] + coords[3]) / 2;
    }

    const fingerId = area.getAttribute('data-finger');

    const existingRing = document.getElementById(`placed-${fingerId}`);
    if (existingRing)
    {
      existingRing.remove();
    }

    const mapName = area.parentElement.getAttribute('name');
    const targetContainerId = mapName === 'left-hand-map' ? 'leftHandContainer' : 'rightHandContainer';
    const activeContainer = document.getElementById(targetContainerId);
    
    if (!activeContainer) return;

    const wrapper = document.createElement('div');
    wrapper.classList.add('ring-wrapper');
    wrapper.id = `placed-${fingerId}`;
    wrapper.style.position = 'absolute';
    wrapper.style.left = `${centerX}px`;
    wrapper.style.top = `${centerY}px`;
    wrapper.style.transform = 'translate(-50%, -50%)';
    wrapper.style.pointerEvents = 'none';

    const ringImg = document.createElement('img');
    ringImg.src = this.#draggedRingSrc;
    ringImg.className = 'placed-ring-graphic';

    wrapper.appendChild(ringImg);
    activeContainer.appendChild(wrapper);
  }
}

// Automatically instantiate the application scope
let ringUi = new RingMapUi();