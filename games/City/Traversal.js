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
		let visited = new Set();// Array(graph.nodes.length).fill(false);
		let allPaths = [];
		queue.push(s);
		while (queue.length) {
			let curr = queue.shift();
			//path += curr.id + ' ';
			visited.add(curr.id);
			allPaths[curr.id] = [];
			//console.log('in bfs', curr.id);
			if (e.id && (curr.id == e.id)) {

				//JOIN THE PATHS TOGETHER THAT LEAD FROM e.id => s.id 
				/*let paths = allPaths[e.id];
				let finalPath = [];
				while(paths.length > 0){
					let currentPath = paths[0];
					finalPath.push(currentPath);
					if(allPaths[currentPath].length > 0){
						paths = allPaths[currentPath];
					}
				}
				console.log('allPaths',allPaths,'final',finalPath);
				
				//console.log(path);
				//return this.recreatePath(visited, curr.id);
				let path = Array.from(visited.values());
				let parentPath = new Set();
				for(let i = 0; i < path.length; i++){
					let cNode = graph.getNodeById(path[i]);
					//console.log(i, cNode.parent);
					if(cNode.parent && visited.has(cNode.parent.id)){
						parentPath.add(cNode.parent.id);
					}
				}
				//console.log('allPaths',allPaths);
				console.log('allPaths',allPaths[s.id]);
				console.log('parentPath',Array.from(parentPath.values()));
				*/

				return this.outputPath(graph, visited);
			}
			let n = curr.getNeighbours();
			for (let i = 0; i < n.length; i++) {
				let neighbour = n[i];
				if (!visited.has(neighbour.id)) {
					//console.log('bfs addN', neighbour.id);
					visited.add(neighbour.id);
					//neighbour.parent = curr;
					allPaths[curr.id].push(neighbour);
					queue.push(neighbour);
				}
			}
		}
		return false;
	}

	/**
	 * Depth-first search.
	 * @param {Graph} graph The graph to traverse.
	 * @param {Node} s The start node.
	 * @param {Node|boolean} e The end node (default: false);
	 * @return {array|boolean} The path, or false if not matched.
	  */
	static dfs(graph, s, e = false, visited = false)
	{
		if (!visited) {
			visited = new Set();
		}
		//Add current node.id to visited
		visited.add(s.id);
		//If the current node.id == end.id
		if (e.id && (s.id == e.id)) {
			//Finished - recreate path 
			//return this.recreatePath(visited, e.id);
			return this.outputPath(graph, visited);
			//return visited;
		}
		//Get neighbours of current node
		let neighbours = s.getNeighbours();
		//Iterate neighbours
		for (let neighbour of neighbours) {
			//If this neighbour has not been visited
			if (!visited.has(neighbour.id)) {
				//console.log('unvisited neighbour',neighbour);
				//Run DFS on this neighbour
				return this.dfs(graph, neighbour, e, visited);
			}
		}
		//console.log('dfs visited',Array.from(visited.keys()).join(','));
		return visited;
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
			//console.log(node);
			distances[node.id] = Infinity;
		}
		distances[start.id] = 0;
		while (nodes.length) {
			//console.log('dij',iterCount++);
			//GET SHORTEST DISTANCE (BY EDGE WEIGHT)
			nodes.sort((a, b) => distances[a.id] - distances[b.id]);
			let closestNode = nodes.shift();
			if (distances[closestNode.id] === Infinity) {
				//console.log('close inf', closestNode);
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
						if (end.id && (end.id == neighbour.id)) {
							//END SPECIFIED, RETURN [minDistToEnd, allDistances]
							//return [distances[end.id], distances];
							return this.outputPath(graph, visited);
						}
					}
				}
			}
		}
		//NO END SPECIFIED, RETURN ALL DISTANCES
		return distances;
	}

	static recreatePath(cameFrom, current)
	{
		return [Array.from(cameFrom.values()).join('->'), cameFrom.size];
		let path = current;
		while (cameFrom.has(current)) {
			cameFrom.delete(current);
			current = this.getLastValue(cameFrom);
			path += ',' + current;
		}
		return path;
	}

	static outputPath(graph, path)
	{
		let nodes = Array.from(path.values());
		console.log('opPath',nodes)
		const delayMs = 500;
		//console.log('og', nodes);
		let index = 0;
		while (nodes.length !== 0) {
			let node = nodes.splice(0, 1)[0];
			//console.log('out', node, index);
			let options = {};
			options.rowSize = graph.rows;
			options.colSize = graph.cols;
			options.highlightNode = node;
			
			if(nodes.length > 0){
				//console.log('edgebtw',graph.getNodeById(nodes[0]),graph.getNodeById(node));
				let edge = graph.getEdgeBetween(graph.getNodeById(nodes[0]), graph.getNodeById(node));
				options.highlightEdge = edge.id;
			}
			let cnv = document.getElementById('graphs');
			setTimeout(this.drawGraph, index * delayMs, graph, cnv, options);
			//this.drawGraph(graph,cnv,options);
			index++;
		}
	}

	static getLastValue(set)
	{
		let value;
		for (value of set);
		return value;
	}

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

	static drawGraph(graph, canvas, options = false)
	{
		//console.log('drawG',options);
		let ctx = canvas.getContext('2d');
		//Clear
		ctx.fillStyle = '#fff';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.moveTo(10, 10);
		//Coord settings
		const nodeSize = 15;
		const xMargin = 25;
		const yMargin = 25;
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
				if (options.highlightNode && (options.highlightNode == node.id)) {
					highlight = true;
				}
				Traversal.drawNode(ctx, node, x, y, nodeSize, highlight);
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
						if(options.highlightEdge && (options.highlightEdge == edge.id)){
						highlight = true;
						}
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
						if (options.highlightEdge && (options.highlightEdge == edge.id)) {
						highlight = true;
						}
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
		ctx.fillText(edge.id, (end.x + start.x)/2, (end.y + start.y)/2);
		//ctx.fill();
		ctx.closePath();
		ctx.fillStyle = '#000';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 2;
	}
	
	static drawNode(ctx, node, x, y, r, highlight=false)
	{
		ctx.beginPath();
		//ctx.moveTo(x,y);
		if(highlight){
			ctx.strokeStyle = '#f00';
			ctx.fillStyle = '#f00';
			ctx.lineWidth = 1;
			ctx.arc(x, y, r, 2 * Math.PI, 0, 2 * Math.PI, false);
			ctx.stroke();
			ctx.fill();
		} else {
			ctx.fillStyle = '#000';
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
			//Draw node 
			ctx.arc(x, y, r, 2 * Math.PI, 0, 2 * Math.PI, false);
			//ctx.fill();
			ctx.stroke();
		}
		ctx.closePath();
		ctx.strokeStyle = '#f00';
		ctx.fillStyle = '#f00';
		ctx.lineWidth = 1;
		ctx.fillText(node.id, x-7, y+2)
	}

}
