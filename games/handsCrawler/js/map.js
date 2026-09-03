//INIT THE RING DATA AND CREATE RINGS
async function loadItemData() 
{
  try
  {
    const response = await fetch(itemDataJsonPath); 
        
    if (!response.ok)
    {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
        
    const data = await response.json();
    let ringsInfo = data.items.rings;
    ringsInfo.forEach(r => {
      let ringImg = document.createElement('img');
      ringImg.src = r.icon;
      ringImg.className = 'ring-item';
			ringImg.draggable = true; 
			ringImg.id = r.id;
			ringImg.alt = r.name;
			ringImg.tooltip = r.name;
			ringOptionsArea.appendChild(ringImg);
			initDragEvents();
    });
  }
  catch (error)
  {
    console.error("Failed to load JSON file:", error);
  }
}
	
//INIT GLOBAL VARS
let draggedRingSrc = null;
let isDragging = false;
let dragVisualElement = null; // Track our visual feedback element globally
const ringOptionsArea = document.getElementById('ring-options');
ringOptionsArea.innerHTML = null;
//SET CLASS NAMES / TAGS / IDs
const ringItemsClassName = 'ring-item';
const dragVisualElementId = 'dragVisual';
const dropAreaTagName = 'area';
const highlightClassName = 'area-highlight-overlay';
const gameScalerId = 'gameScaler';
const itemDataJsonPath = './data/itemData.json';

//SETUP THE DRAG EVENTS
function initDragEvents()
{
	//APPLY DRAG EVENTS FOR EACH RING
	document.querySelectorAll
		('.' + ringItemsClassName)
		.forEach(ring => {
	
			//==================
			// DRAG START 
			//==================
	
			// --- DESKTOP LOGIC ---
			ring.addEventListener('dragstart', (e) => {
				const imgElement = e.currentTarget.tagName === 'IMG' 
					? e.currentTarget 
					: e.currentTarget.querySelector('img');
	
				if (imgElement) {
					isDragging = true;
					draggedRingSrc = imgElement.src;
					e.dataTransfer.setData('text/plain', imgElement.src);
					highlightDropAreas(true);
				}
			});
	
			// --- MOBILE FALLBACK INITIALIZATION ---
			ring.addEventListener('pointerdown', (e) => {
				const imgElement = e.currentTarget.tagName === 'IMG' 
					? e.currentTarget 
					: e.currentTarget.querySelector('img');
	
				if (imgElement)
				{
					isDragging = true;
					draggedRingSrc = imgElement.src;
					highlightDropAreas(true);
	
					// Capture pointer focus to ensure movement tracking continues if finger slips
					ring.setPointerCapture(e.pointerId);
					
					// Create the visual proxy element immediately on down action
					dragVisualElement = document.createElement('img');
					dragVisualElement.id = 'dragVisual';
					dragVisualElement.src = draggedRingSrc;
					dragVisualElement.style.position = 'fixed'; // Fixed positioning scales better across layouts
					dragVisualElement.style.width = `${imgElement.offsetWidth}px`;
					dragVisualElement.style.height = `${imgElement.offsetHeight}px`;
					dragVisualElement.style.pointerEvents = 'none'; // Critical: allows dropping beneath itself
					dragVisualElement.style.zIndex = '9999';
					updateVisualPosition(e.clientX, e.clientY);
					document.body.appendChild(dragVisualElement);
				}
			});
	
			//==================
			// DRAG END (DROP) 
			//==================
	
			// --- DESKTOP NATIVE CLEANUP ---
			ring.addEventListener('dragend', () => {
				isDragging = false;
				highlightDropAreas(false);
				
				// Clean up any proxy images abandoned by pointerdown
				if (dragVisualElement) {
					dragVisualElement.remove();
					dragVisualElement = null;
				}
			});
	
			// --- MOBILE RELEASE LOGIC ---
			ring.addEventListener('pointerup', (e) => {
				if (!isDragging) return;
				highlightDropAreas(false);
				isDragging = false;
				if (e.pointerId === undefined)
				{
					dragVisualElement.remove();
					dragVisualElement = null;
					return;
				}
				ring.releasePointerCapture(e.pointerId);
				
				if (dragVisualElement)
				{
					dragVisualElement.remove();
					dragVisualElement = null;
				}
				
				const fingerX = e.clientX;
				const fingerY = e.clientY;
				
				let targetArea = null;
				
				for (let area of document.querySelectorAll(dropAreaTagName)) {
					const map = area.parentElement;
					const linkedImg = document.querySelector(`img[usemap="#${map.name}"]`);
					
					if (!linkedImg) continue;
					
					const rect = linkedImg.getBoundingClientRect();
					
					// CRITICAL FIX: Calculate the responsive layout scaling ratios
					const scaleX = rect.width / linkedImg.naturalWidth;
					const scaleY = rect.height / linkedImg.naturalHeight;
					
					const coords = area.coords.split(',').map(Number);
					
					if (area.shape === 'rect' || !area.shape) {
						// Apply scale ratios directly to HTML coordinates
						const left = rect.left + (coords[0] * scaleX);
						const top = rect.top + (coords[1] * scaleY);
						const right = rect.left + (coords[2] * scaleX);
						const bottom = rect.top + (coords[3] * scaleY);
						
						if (fingerX >= left && fingerX <= right && fingerY >= top && fingerY <= bottom) {
							targetArea = area;
							break;
						}
					}
					else if (area.shape === 'circle') {
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
					executeDropLogic(targetArea);
				} else {
					console.log("Dropped outside a valid finger area slot");
				}
				clearDragVisualElements();
			});
	
			//==================
			// DRAG MOVE 
			//==================
	
			// --- DESKTOP EVENT ---
			ring.addEventListener('dragmove', (e) => {
				if (!isDragging || !dragVisualElement) return;
				updateVisualPosition(e.clientX, e.clientY);
				
				// Tracks hover positions on mobile layout views in real-time
				updateActiveHoverState(e.clientX, e.clientY);
			});
	
			// --- MOBILE EVENT TRACKING ---
			ring.addEventListener('pointermove', (e) => {
				if (!isDragging || !dragVisualElement) return;
				updateVisualPosition(e.clientX, e.clientY);
				
				// Tracks hover positions on mobile layout views in real-time
				updateActiveHoverState(e.clientX, e.clientY);
			});
	
			// Prevent context menu interactions blocking dragging
			ring.addEventListener('contextmenu', (e) => e.preventDefault());
		});
	}

	// Helper function to lock visual proxy positioning onto cursor/finger coordinates
	function updateVisualPosition(clientX, clientY)
	{
		if (!dragVisualElement) return;
		dragVisualElement.style.left = `${clientX - dragVisualElement.offsetWidth / 2}px`;
		dragVisualElement.style.top = `${clientY - dragVisualElement.offsetHeight / 2}px`;
	}

	// --- DESKTOP STANDARD LISTENERS ---
	const areas = document.querySelectorAll(dropAreaTagName);
	areas.forEach(area => {
		area.addEventListener('dragover', (e) => {
			e.preventDefault();
			// Tracks desktop native mouse hover positions across layers
			updateActiveHoverState(e.clientX, e.clientY);
		});
		area.addEventListener('drop', (e) => {
			e.preventDefault();
			if(!isDragging) return;
			isDragging = false;
			executeDropLogic(area);
		});
	});

	// --- CENTRALIZED ISOLATED PRODUCTION DROP LOGIC ---
	function executeDropLogic(area) 
	{
		highlightDropAreas(false);
		clearDragVisualElements();
		const coords = area.coords.split(',').map(Number);
		let centerX = (coords[0] + coords[2]) / 2;
		let centerY = (coords[1] + coords[3]) / 2;

		const fingerId = area.getAttribute('data-finger');

		const existingRing = document.getElementById(`placed-${fingerId}`);
		if (existingRing) {
			existingRing.remove();
		}

		const mapName = area.parentElement.getAttribute('name');
		const targetContainerId = mapName === 'left-hand-map' ? 'leftHandContainer' : 'rightHandContainer';
		const activeContainer = document.getElementById(targetContainerId);

		const wrapper = document.createElement('div');
		wrapper.classList.add('ring-wrapper');
		wrapper.id = `placed-${fingerId}`;
		
		let ringRotateAngle = '0deg';
		if (fingerId === "right-thumb") {
			ringRotateAngle = '-30deg';
			centerX += 6;
			centerY -= 10;
		} else if (fingerId === "left-thumb") {
			ringRotateAngle = '30deg';
			centerX -= 10;
			centerY += 6;
		}
		
		wrapper.style.rotate = ringRotateAngle;
		wrapper.style.left = `${centerX}px`;
		wrapper.style.top = `${centerY}px`;

		const ringImg = document.createElement('img');
		ringImg.src = draggedRingSrc;
		ringImg.classList.add('clipped-ring');

		wrapper.appendChild(ringImg);
		activeContainer.appendChild(wrapper);
	}

	//EFFECTS FOR HOVER OVER DROP BOXES
	function updateActiveHoverState(clientX, clientY)
	{
		// 1. Remove the hover state class from all active overlays first
		document.querySelectorAll('.' + highlightClassName).forEach(box => box.classList.remove('is-hovered'));

		// 2. Fetch the active scaling multiplier factor from your game scaler container
		const gameScaler = document.getElementById('gameScaler');
		let currentScale = 1;
		if (gameScaler && gameScaler.style.transform) {
			// Extracts the numerical value out of "scale(0.75)"
			const match = gameScaler.style.transform.match(/scale\(([^)]+)\)/);
			if (match && match[1]) {
				currentScale = parseFloat(match[1]);
			}
		}

		// 3. Scan boundaries to see if coords sit inside any finger zone
		for (let area of document.querySelectorAll(dropAreaTagName)) {
			const map = area.parentElement;
			const linkedImg = document.querySelector(`img[usemap="#${map.name}"]`);
			if (!linkedImg) continue;

			const rect = linkedImg.getBoundingClientRect();
			const coords = area.coords.split(',').map(Number);
			let isInside = false;

			if (area.shape === 'circle') {
				// Apply scale multiplier directly to your area map coordinates parameters
				const centerX = rect.left + (coords[0] * currentScale);
				const centerY = rect.top + (coords[1] * currentScale);
				const radius = coords[2] * currentScale;
				
				const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));
				if (distance <= radius) isInside = true;
			} 
			else if (area.shape === 'rect' || !area.shape) {
				// Apply scale multiplier directly to your area map coordinates parameters
				const left = rect.left + (coords[0] * currentScale);
				const top = rect.top + (coords[1] * currentScale);
				const right = rect.left + (coords[2] * currentScale);
				const bottom = rect.top + (coords[3] * currentScale);
				
				if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) isInside = true;
			}

			if (isInside) {
				const index = area.getAttribute('data-area-index');
				const matchingOverlay = document.querySelector(`.` + highlightClassName + `[data-area-index="${index}"]`);
				if (matchingOverlay) {
					matchingOverlay.classList.add('is-hovered');
				}
				break; 
			}
		}
	}

	//HIGHLIGHT THE CURRENTLY HOVERED DROP AREA
	function highlightDropAreas(showHighlight = false)
	{
		// 1. Clear out previous highlight elements safely using your variable name
		document.querySelectorAll('.' + highlightClassName).forEach(box => box.remove());
		if (!showHighlight) return;

		// Grab your scaling container element
		const gameScaler = document.getElementById('gameScaler');
		if (!gameScaler) return;

		document.querySelectorAll(dropAreaTagName).forEach((area, index) => {
			const map = area.parentElement;
			const linkedImg = document.querySelector(`img[usemap="#${map.name}"]`);
			if (!linkedImg) return;

			// Find the parent hand-wrapper element
			const handWrapper = linkedImg.closest('.hand-wrapper');
			if (!handWrapper) return;

			const coords = area.coords.split(',').map(Number);

			const overlay = document.createElement('div');
			// Use your variable name here to ensure matches work during cleanups
			overlay.classList.add(highlightClassName); 
			
			overlay.setAttribute('data-area-index', index);
			area.setAttribute('data-area-index', index);

			// CHANGE: Use absolute layout positions relative to the container frame
			overlay.style.position = 'absolute';
			overlay.style.pointerEvents = 'none'; 
			overlay.style.border = '2px dashed #ff0000';
			overlay.style.backgroundColor = 'rgba(255, 0, 0, 0.15)'; 
			overlay.style.zIndex = '999';

			if (area.shape === 'circle') {
				const centerX = coords[0];
				const centerY = coords[1];
				const radius = coords[2];

				overlay.style.borderRadius = '50%'; 
				overlay.style.width = `${radius * 2}px`;
				overlay.style.height = `${radius * 2}px`;
				// Math uses coordinates directly relative to the wrapper boundaries
				overlay.style.left = `${centerX - radius}px`;
				overlay.style.top = `${centerY - radius}px`;
			}
			else if (area.shape === 'rect' || !area.shape) {
				overlay.style.borderRadius = '4px'; 
				overlay.style.left = `${coords[0]}px`;
				overlay.style.top = `${coords[1]}px`;
				overlay.style.width = `${coords[2] - coords[0]}px`;
				overlay.style.height = `${coords[3] - coords[1]}px`;
			}

			// CRITICAL FIX: Append directly to the unscaled parent container block
			handWrapper.appendChild(overlay);
		});
	}

function clearDragVisualElements()
{
  let visuals = document.querySelectorAll('#' + dragVisualElementId);
  visuals.forEach(el => {
    document.body.removeChild(el);
  });
}

	//Auto-scaling behavior matching layout container limits
	function resizeGameViewport()
	{
		const scaler = document.getElementById(gameScalerId);
		if (!scaler) return;

		// Define absolute bounding area needed for full display unscaled
		const targetWidth = 540;  // 256px left hand + 256px right hand + gap spacing offsets
		const targetHeight = 420; // Structural grid sizing containing elements vertically

		// Calculate view multipliers relative to screen dimensions
		const scaleX = window.innerWidth / targetWidth;
		const scaleY = window.innerHeight / targetHeight;

		// Choose whichever scaling restriction factor is lowest to prevent off-screen cropping
		let optimalScale = Math.min(scaleX, scaleY);

		// Do not scale up layout if screen is wide (e.g. standard laptops/monitors)
		if (optimalScale > 1) optimalScale = 1;

		// Apply the transformer rule instantly
		scaler.style.transform = `scale(${optimalScale})`;
	}

// Bind events to listen for scaling view recalculations
window.addEventListener('resize', resizeGameViewport);
window.addEventListener('DOMContentLoaded', resizeGameViewport);
	
//Now load the item data to generate rings
loadItemData();