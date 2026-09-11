class MapGenerator 
{
	#nodeTypes = [
		'chest',    // 0
		'battle',   // 1
		'event',    // 2
		'merchant', // 3
		'boss'      // 4
	];
	
	constructor() {}
	
	generateMap(hNodes = 5, vNodes = 3)
	{
		let nodeMap = [];
		let nodeType = 0; 
		
		let node0 = { id: 0, x: 0, y: 50, type: 0, connections: [1, 2] };
		nodeMap.push(node0);
		
		nodeType = this.getRandomNode(0,3);
		let node1 = { id: 1, x: 25, y: 25, type: nodeType, connections: [3, 4] };
		nodeMap.push(node1);
		
		nodeType = this.getRandomNode(0,3);
		let node2 = { id: 2, x: 25, y: 75, type: nodeType, connections: [4, 5] };
		nodeMap.push(node2);
		
		nodeType = this.getRandomNode(0,3);
		let node3 = { id: 3, x: 50, y: 0, type: nodeType, connections: [6] };
		nodeMap.push(node3);
		
		nodeType = this.getRandomNode(0,3);
		let node4 = { id: 4, x: 50, y: 50, type: nodeType, connections: [6, 7] };
		nodeMap.push(node4);
		
		nodeType = this.getRandomNode(0,3);
		let node5 = { id: 5, x: 50, y: 100, type: nodeType, connections: [7] };
		nodeMap.push(node5);
		
		// Fixed: Corrected X and Y positions based on your diagram map grid
		nodeType = this.getRandomNode(0,3);
		let node6 = { id: 6, x: 75, y: 25, type: nodeType, connections: [8] };
		nodeMap.push(node6);
		
		nodeType = this.getRandomNode(0,3);
		let node7 = { id: 7, x: 75, y: 75, type: nodeType, connections: [8] };
		nodeMap.push(node7);
		
		nodeType = this.getRandomNode(0,3);
		let node8 = { id: 8, x: 100, y: 50, type: nodeType, connections: [] };
		nodeMap.push(node8);
		
		return nodeMap;
	}
	
	outputMap(target, map, currentNode = false)
	{
		target.innerHTML = '';
		
		// Safely capture target dimensions
		let targetW = target.clientWidth;
		let targetH = target.clientHeight;
		const nodeRadius = 20;
		// First pass, output points
		for(let i = 0; i < map.length; i++)
		{
			let node = map[i];
			let div = document.createElement('div');
			div.classList.add('map-node');
			div.classList.add(this.#nodeTypes[node.type]);
			div.id = 'node' + node.id;
			
			//If no node (completed) then only allow click on node0
			if(currentNode === false && i === 0)
			{
				div.classList.add('moveable');
				div.addEventListener('click', (e) => {
					moveToMapNode(e.target);
				});
			}
			//Current node highlight
			else if(currentNode !== false && currentNode == node.id)
			{
				div.classList.add('current');
			}
			//Connected to current highlights
			else if(currentNode !== false)
			{
				if(map[currentNode].connections.includes(i))
				{
					div.classList.add('moveable');
					div.addEventListener('click', (e) => {
						moveToMapNode(e.target);
					});
				}
			}
			
			let left = (node.x / 100) * targetW;
			left -= nodeRadius / 2;
			let top = (node.y / 100) * targetH;
			top -= nodeRadius / 2;
			
			div.style.left = left + 'px';
			div.style.top = top + 'px';
			div.style.width = nodeRadius + 'px';
			div.style.height = nodeRadius + 'px';
			
			target.appendChild(div);
		}
		
		// Second pass, output connections
		for(let i = 0; i < map.length; i++)
		{
			let node = map[i];
			for(let c = 0; c < node.connections.length; c++)
			{
				let line = document.createElement('hr');
				let eNodeId = node.connections[c];
				line.id = 'connect-' + node.id + '-' + eNodeId;
				line.classList.add('map-line');
				
				let sNode = node;
				let eNode = map[eNodeId];
				
				// Translate node percentage coordinates to real-world target pixel positions
				let sPixel = { x: (sNode.x / 100) * targetW, y: (sNode.y / 100) * targetH };
				let ePixel = { x: (eNode.x / 100) * targetW, y: (eNode.y / 100) * targetH };
				
				// Calculate true pixel distance & midpoint
				let distance = this.getDistanceBetween(sPixel, ePixel);
				let midpoint = this.getMidpoint(sPixel, ePixel);
				let angle = this.getAngleBetween(sPixel, ePixel);
				
				// Style line to stretch smoothly outwards from its midpoint anchor
				line.style.width = distance + 'px';
				line.style.left = (midpoint.x - distance / 2) + 'px';
				line.style.top = midpoint.y + 'px';
				line.style.transform = 'rotate(' + angle + 'deg)';
				
				target.appendChild(line);
			}
		}
	}
	
	getDistanceBetween(sNode, eNode)
	{
		let yDiff = eNode.y - sNode.y;
		let xDiff = eNode.x - sNode.x;
		return Math.sqrt((yDiff * yDiff) + (xDiff * xDiff));
	}
	
	getAngleBetween(sNode, eNode)
	{
		let yDiff = eNode.y - sNode.y;
		let xDiff = eNode.x - sNode.x;
		return Math.atan2(yDiff, xDiff) * (180 / Math.PI);
	}
	
	getMidpoint(sNode, eNode)
	{
		return {
			x: (sNode.x + eNode.x) / 2,
			y: (sNode.y + eNode.y) / 2
		};
	}
	
	getRandomNode(min = 0, max = 4)
	{
		return Math.floor(min + (Math.random() * (max - min)));
	}
}