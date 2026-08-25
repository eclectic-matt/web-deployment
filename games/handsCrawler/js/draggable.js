//The places where a draggable can be dropped
let dropZones = document.querySelectorAll('.drop-zone');
//The element containing all draggable elements
let draggablePool = document.getElementById('draggable-pool');
//The elements that can be dragged
let draggables = document.querySelectorAll('.draggable');
//The selected draggable element
let currentDraggable = null;

const setupDraggables = () => {

	//The places where a draggable can be dropped
	dropZones = document.querySelectorAll('.drop-zone');
	//The element containing all draggable elements
	draggablePool = document.getElementById('draggable-pool');
	//The elements that can be dragged
	draggables = document.querySelectorAll('.draggable');

	draggables.forEach(draggable => {
		draggable.setAttribute('draggable', 'true');

		draggable.addEventListener('dragstart', (e) => {
			currentDraggable = draggable;
			setTimeout(() => draggable.style.opacity = '0.4', 0);
		});

		draggable.addEventListener('dragend', () => {
			setTimeout(() => {
				if (currentDraggable)
				{
					currentDraggable.style.opacity = '1';
					currentDraggable = null;
				}
			}, 0);
			//Handle drop event here
			//calculateEquation();
		});
	});

	dropZones.forEach(zone => {
		zone.addEventListener('dragover', e => {
			e.preventDefault();
			zone.classList.add('drag-over');
		});

		zone.addEventListener('dragleave', () => {
			zone.classList.remove('drag-over');
		});

		zone.addEventListener('drop', e => {
			e.preventDefault();
			zone.classList.remove('drag-over');

			// If target zone already holds a draggable, move old draggable back to tray
			if (zone.children.length > 0)
			{
				draggablePool.appendChild(zone.children[0]);
			}

			if (currentDraggable)
			{
				zone.appendChild(currentDraggable);
			}
		});
	});

	// Allow clicking/dropping back directly onto pool area container
	draggablePool.addEventListener('dragover', e => e.preventDefault());
	draggablePool.addEventListener('drop', e => {
		e.preventDefault();
		if (currentDraggable) 
		{
			draggablePool.appendChild(currentDraggable);
		}
	});
}