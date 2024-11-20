class Traversal 
{
	/**
   * Breadth-first search of this graph.
   * @param {Graph} graph The graph to search.
   * @param {array} adj The array of edges.
   * @param {Node} s The start node.
   * @param {Node} e The end node.
   */
	static bfs(graph, s, e = false)
	{
		//Queue is an array of nodes
		let queue = [];
		//Visited is the set of nodes visited in order
		let visited = new Set();
		queue.push(s);
		while (queue.length) {
			let curr = queue.shift();
			visited.add(curr.id);
			let n = curr.getNeighbours();
			for (let i = 0; i < n.length; i++) {
				let neighbour = n[i];
				if (!visited.has(neighbour.id)) {
					visited.add(neighbour.id);
					queue.push(neighbour);
				}
			}
		}
		//return this.outputPath(graph, visited);
		return [ visited ];
	}

	/**
	 * Depth-first search.
	 * @param {Graph} graph The graph to traverse.
	 * @param {Node} s The start node.
	 * @return {array|boolean} The path, or false if not matched.
	  */
	static dfs(graph, s, e = false, visited = false)
	{
	  //If initializing
		if (!visited) {
			visited = new Set();
		}
		//Add current node.id to visited
		visited.add(s.id);
		//Get neighbours of current node
		let neighbours = s.getNeighbours();
		//Iterate neighbours
		for (let neighbour of neighbours) {
			//If this neighbour is not visited
			if (!visited.has(neighbour.id)) {
				//Run DFS on this neighbour
				return this.dfs(graph, neighbour, e, visited);
			}
		}
		//return this.outputPath(graph, visited);
		return [ visited ];
	}

	/**
	 * Dijkstra algorithm path search.
	 * @param {Graph} graph The graph to traverse.
	 * @param {Node} s The start node.
	 * @param {Node|boolean} e The end node (default: false);
	 * @return {array|boolean} The path, or false if not matched.
	  */
	static djikstra(graph, start, end = false)
	{
		let iterCount = 0;
		let distances = {};
		let visited = new Set();
		let nodes = Array.from(graph.getNodes());
		for (let node of nodes) {
			distances[node.id] = Infinity;
		}
		distances[start.id] = 0;
		while (nodes.length) {
			//GET SHORTEST DISTANCE (BY EDGE WEIGHT)
			nodes.sort((a, b) => distances[a.id] - distances[b.id]);
			let closestNode = nodes.shift();
			if (distances[closestNode.id] === Infinity) {
				break;
			}
			visited.add(closestNode.id);
			let neighbours = closestNode.getNeighbours();
			for (let neighbour of neighbours) {
				if (!visited.has(neighbour.id)) {
					let edge = graph.getEdgeBetween(closestNode, neighbour);
					let newDistance = distances[closestNode.id] + edge.getWeight();
					if (newDistance < distances[neighbour.id]) {
						distances[neighbour.id] = newDistance;
						/*if (end.id && (end.id == neighbour.id)) {
						  //End specified and found
							return [ visited, distances ];
						}*/
					}
				}
			}
		}
		console.log('djikstra',Array.from(visited.values()),distances);
		return [visited, distances];
	}
	
	
	
	
	

	static recreatePath(cameFrom, current)
	{
		return [Array.from(cameFrom.values()).join('->'), cameFrom.size];
		//OLD VERSION BELOW:
		let path = current;
		while (cameFrom.has(current)) {
			cameFrom.delete(current);
			current = this.getLastValue(cameFrom);
			path += ',' + current;
		}
		return path;
	}
	
	static backwardsWalk(visited, s, e)
	{
		//Get the path
		let path = Array.from(visited.values());
		let minPath = [];
		let currentNode = e;
		let checks = path.length;
			
		//Perform a backwards, neighbours search of the visited nodes, skipping neighbours where possible
			
		//Remove end from path (don't match end)
		path.splice(-1);

		while(path.length > 0 && checks > 0) {
			
			//safety loop
			checks--;
			
			minPath.push(currentNode.id);
			if(currentNode.id == s.id){ 
				break;
			}

			//get neighbours of current node 
			let n = currentNode.getNeighbours();
			//find neighbour which is lower in the visted list 
			let nIds = n.map( (node) => { return node.id});
			//minNeighbour (index in neighbours)
			let minNeighbour = false;
			//minIdx (index of neighbour id within paths array)
			let minIdx = -1;
			//Iterate neighbour ids
			for(let i=0;i<nIds.length;i++){
				//get the index within path of this neighbour
				let pIdx = path.indexOf(nIds[i]);
				//If found in path
				if(pIdx !== -1){
					//and minIdx=false
					if(minIdx === -1){
						//use this as minIdx
						minIdx = pIdx;
						minNeighbour = i;
					}else{
						if(pIdx < minIdx){
							minIdx = pIdx;
							minNeighbour = i;
						}
					}
				}
			}
			//
			if(minNeighbour!==false){
				//Set current to min neighbour
				currentNode = n[minNeighbour];
				//Remove path elements smaller than the current node
				path.splice(minIdx);
			}
		}
		
		//Add start Id onto path (again?)
		minPath.push(s.id);
		minPath.reverse();
		let setMinPath = new Set();
		for(let id of minPath){
			setMinPath.add(id);
		}
		return setMinPath;
	}
	
	
	

	static outputPath(graph, path, distances=false, delayMs=1000)
	{
		let nodes = Array.from(path.values());
		let allNodes = Array.from(path.values());
		let index = 0;
		while (nodes.length !== 0) {
			let node = nodes.splice(0, 1)[0];
			let options = {};
			options.rowSize = graph.rows;
			options.colSize = graph.cols;
			options.highlight = {};
			options.highlight.path = allNodes;
			options.highlight.current = node;
			if(distances){
				options.distances = distances;
			}
			let cnv = document.getElementById('graphs');
			let t = setTimeout(this.drawGraph, index * delayMs, graph, cnv, options);
			window.timers.push(t);
			index++;
		}
	}
	
	static drawGraph(graph, canvas, options=false)
	{
		//console.log('drawG',options);
		let ctx = canvas.getContext('2d');
		//Clear
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.moveTo(10, 10);
		//Coord settings
		//const nodeSize = 15;
		const nodeSize = Math.floor(100 / options.rowSize);
		const xMargin = 150 / options.rowSize;
		const yMargin = 150 / options.colSize;
		
		const xSpace = ((canvas.width - (2 * xMargin)) / options.rowSize);
		const ySpace = ((canvas.height - (2 * yMargin)) / options.colSize);
		
		//Init drawn nodes array 
		let drawn = [];
		let nodeGrid = [];
		let nodes = graph.nodes;
		//console.log('nodes', nodes);
		const chunkSize = options.rowSize;
		for (let i = 0; i < nodes.length; i += chunkSize) {
			nodeGrid.push(nodes.slice(i, i + chunkSize));
		}
		
		//console.log(nodeGrid);
		for (let row = 0; row < options.rowSize; row++) {
			for (let col = 0; col < options.colSize; col++) {
				//Reset styles
				ctx.strokeStyle = '#000';
				ctx.fillStyle = '#000';
				ctx.lineWidth = 1;
				let x = (col*xSpace) + xMargin;
				let y = (row*ySpace) + yMargin;
				ctx.moveTo(x, y);
				let node = nodeGrid[row][col];
				ctx.beginPath();
				let highlight=false;
				let nodeIndex = options.highlight.path.indexOf(node.id);
				let currentIndex = options.highlight.path.indexOf(options.highlight.current);
				let nodeHighlight = (nodeIndex <= currentIndex);
				let nodeName = (nodeHighlight ? (nodeIndex + 1) : node.name);
				if(options.distances){
					nodeName = options.distances[node.id];
				}
				
				let scaledIndex = Math.floor(nodeIndex / (options.highlight.path.length - 1) * 16);
				let nodeColor = (nodeHighlight ? '#' + (15 - scaledIndex).toString(16) + '0' + scaledIndex.toString(16) : '#fff' );
				let nodeOptions = {};
				nodeOptions.nodeColor = nodeColor;
				nodeOptions.nodeName = nodeName;
				
				Traversal.drawNode(ctx, node, x, y, nodeSize, nodeOptions);
				
				drawn.push(node);
				let neighbours = node.getNeighbours();
				let oName = node.name;
				const re = /grid\[(\d+),(\d+)\]/;
				//bool flag if every neighbour has been drawn
				let neighboursDrawn = (drawn, neighbours) => target.every(v => drawn.includes(v));
				
				if (neighboursDrawn) {
					if(col !== (options.colSize -1)){
						//Draw edges - right
						let start = {};
						start.x = x + nodeSize;
						start.y = y;
						let end = {};
						end.x = ((col + 1) * xSpace) + xMargin - nodeSize;
						end.y = y;
						//let edge = graph.getEdgeBetween(node, neighbours[1]);
						//right name 
						let matches = node.name.match(re);
						//console.log(node.name, matches);
						let cName = 'grid[' + (matches[1]) + ',' + (parseInt(matches[2])+1) + ']';
						let edge = graph.getEdgeBetween(node, graph.getNodeByName(cName));
						let highlight = false;
						/*if(options.highlightEdge && (options.highlightEdge == edge.id)){
						highlight = true;
						}*/
						Traversal.drawEdge(ctx, edge, start, end, highlight);
					}
					if(row !== (options.rowSize - 1)){
						//down
						let start = {};
						start.x = x;
						start.y = y + nodeSize;
						let end = {};
						end.x = x;
						end.y = ((row + 1) * ySpace) + yMargin - nodeSize;
						//let edge = graph.getEdgeBetween(node, neighbours[0]);
						let matches = node.name.match(re);
						//console.log(node.name, matches);
						let rName = 'grid[' + (parseInt(matches[1]) +1) + ',' + matches[2] + ']';
						let edge = graph.getEdgeBetween(node, graph.getNodeByName(rName));
						let highlight = false;
						/*if (options.highlightEdge && (options.highlightEdge == edge.id)) {
						highlight = true;
						}*/
						Traversal.drawEdge(ctx, edge, start, end, highlight);
					}
				}
			}
		}
	}
	
	static drawEdge(ctx, edge, start, end, highlight=false)
	{
		ctx.beginPath();
		ctx.moveTo(start.x, start.y);
		if(highlight){
			//HIGHLIGHT
			ctx.fillStyle = '#f00';
			ctx.strokeStyle = '#f00';
			ctx.lineWidth = 5;
		}else{
			//DEFAULT
			ctx.fillStyle = '#000';
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 2;
		}
		ctx.lineTo(end.x, end.y);
		ctx.stroke();
		/*if(Math.floor(end.x - start.x) > 10){
			ctx.fontStyle = Math.floor(end.x - start.x) + ' px';
			ctx.fillText(edge.id, (end.x + start.x)/2 - 5, (end.y + start.y)/2 - 2);
		}*/
		//ctx.fill();
		ctx.closePath();
		ctx.fillStyle = '#000';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
	}
	
	static drawNode(ctx, node, x, y, r, options=false)
	{
		ctx.beginPath();
		//ctx.moveTo(x,y);
		//ctx.strokeStyle = options.nodeColor;
		ctx.strokeStyle = '#000';
		ctx.fillStyle = options.nodeColor;
		ctx.lineWidth = 1;
		ctx.arc(x, y, r, 2 * Math.PI, 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.strokeStyle = '#000';
		ctx.fillStyle = '#fff';
		ctx.lineWidth = 1;
		if(r > 5){
			ctx.fillText(options.nodeName, x-7, y+2);
		}
	}

	//OLD - NO LONGER USED
	static outputGraph(graph)
	{
		console.log('NODES (' + graph.nodes.length + ' total)');
		for (let i = 0; i < graph.nodes.length; i++) {
			let node = graph.nodes[i];
			console.log('Node:', node.id, 'Neighbours', node.getNeighbours().map((el) => { return el.id; }).join(","));
		}
		console.log('EDGES (' + graph.edges.length + ' total)');
		for (let i = 0; i < graph.edges.length; i++) {
			let edge = graph.edges[i];
			console.log('Edge:', edge.id, 'Nodes', edge.getNodes().map((el) => { return el.id; }).join(','));
		}
	}
	
	static getLastValue(set)
	{
		let value;
		for (value of set);
		return value;
	}


}
