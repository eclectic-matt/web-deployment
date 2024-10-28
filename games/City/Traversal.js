class Traversal {
	/**
   * Breadth-first search of this graph.
   * @param {Graph} graph The graph to search.
   * @param {array} adj The array of edges.
   * @param {Node} s The start node.
   * @param {Node} e The end node.
   */
	static bfs(graph, s, e = false) {
		//Queue is an array of nodes
		let queue = [];
		//Visited is the set of nodes visited in order
		let visited = new Set();// Array(graph.nodes.length).fill(false);
		queue.push(s);
		while (queue.length) {

			let curr = queue.shift();
			//path += curr.id + ' ';
			visited.add(curr.id);
			//console.log('in bfs', curr.id);
			if (e.id && (curr.id == e.id)) {
				//console.log(path);
				//return this.recreatePath(visited, curr.id);
				return this.outputPath(graph, visited);
				//return path;
			}
			let n = curr.getNeighbours();
			for (let i = 0; i < n.length; i++) {
				let neighbour = n[i];
				if (!visited.has(neighbour.id)) {
					//console.log('bfs addN', neighbour.id);
					visited.add(neighbour.id);
					//neighbour.parent = curr;
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
	static dfs(graph, s, e = false, visited = false) {
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
	static djikstra(graph, start, end = false) {
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

	static recreatePath(cameFrom, current) {
		//console.log('recreatePath',Array.from(cameFrom.keys()).join(','),current);
		/*if(typeof cameFrom == 'object'){
		  return Array.from(cameFrom.keys()).join(',');
		}else{
		  console.log(typeof cameFrom);
		  return cameFrom;
		}*/


		return [Array.from(cameFrom.values()).join('->'), cameFrom.size];
		let path = current;
		while (cameFrom.has(current)) {
			//current = cameFrom[current];
			//cameFrom.shift()
			//cameFrom.splice(cameFrom.indexOf(current));
			//current = cameFrom.delete(current);
			cameFrom.delete(current);
			current = this.getLastValue(cameFrom);
			//current = current.id;
			//path.unshift(current);
			path += ',' + current;
			//path.splice(path.indexOf(current), 1);
		}
		return path;
	}

	static outputPath(graph, path) {
		let nodes = Array.from(path.values());
		//console.log('og', nodes);
		let index = 0;
		while (nodes.length !== 0) {
			let node = nodes.splice(0, 1);
			//console.log('out', node, index);
			let options = {};
			options.rowSize = graph.rows;
			options.colSize = graph.cols;
			options.highlightNode = node[0];
			let cnv = document.getElementById('graphs');
			setTimeout(this.drawGraph, index * 1000, graph, cnv, options);
			//this.drawGraph(graph,cnv,options);
			index++;
		}
	}

	static getLastValue(set) {
		let value;
		for (value of set);
		return value;
	}

	static outputGraph(graph) {
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

	static drawGraph(graph, canvas, options = false) {

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

				let x = (col * xSpace) + xMargin;
				let y = (row * ySpace) + yMargin;

				let node = nodeGrid[row][col];
				ctx.beginPath();
				if (options.highlightNode && (options.highlightNode == node.id)) {
					console.log('highlight', node.id);
					ctx.strokeStyle = '#f00';
					ctx.fillStyle = '#f00';
					ctx.moveTo(x, y);
					ctx.arc(x, y, nodeSize, 2 * Math.PI, 0, 2 * Math.PI, false);
					ctx.stroke();
					ctx.fill();
				} else {
					ctx.strokeStyle = '#000';
					//Draw node 
					ctx.moveTo(x, y);
					ctx.arc(x, y, nodeSize, 2 * Math.PI, 0, 2 * Math.PI, false);
					ctx.stroke();
				}

				ctx.fillText(node.id, x, y);
				ctx.closePath();
				drawn.push(node);
				let neighbours = node.getNeighbours();
				//bool flag if every neighbour has been drawn
				let neighboursDrawn = (drawn, neighbours) => target.every(v => drawn.includes(v));
				if (neighboursDrawn) {
					//if(drawn.contains(neighbours[0]) && drawn.has(neighbours[1])){

					//console.log('drawing neighbour edges', neighbours);
					//Draw edges - right + down
					ctx.beginPath();
					ctx.moveTo(x + nodeSize, y);
					let rX = ((col + 1) * xSpace) + xMargin - nodeSize;
					let rY = (row * ySpace) + yMargin;
					ctx.lineTo(rX, rY);
					ctx.stroke();
					ctx.closePath();

					let edgeR = graph.getEdgeBetween(node, neighbours[0]);
					ctx.fillText(edgeR.id, rX + 10, rY + 10);
					//down 
					ctx.beginPath();
					ctx.moveTo(x, y + nodeSize);
					let dX = (col * xSpace) + xMargin;
					let dY = ((row + 1) * ySpace) + yMargin - nodeSize;
					ctx.lineTo(dX, dY);
					ctx.stroke();
					ctx.closePath();
					let edgeD = graph.getEdgeBetween(node, neighbours[1]);
					ctx.fillText(edgeD.id, dX + 10, dY + 10);
				}
			}
		}
	}

}