class Graph 
{
  id = '';
  name = '';
  nodes = [];
  edges = [];
  
  constructor(id='g1',name='graph'){
    this.id = id;
    this.name = name;
  }
  
  //====================
  // NODE FUNCTIONS
  //====================
  createNode(name=false){
    let id = this.getNextId('node');
    if(!name){
      name = id;
    }
    let node = new Node(id, name);
    this.addNode(node);
    return node;
  }
  addNode(node){
    this.nodes.push(node);
  }
  removeNode(node){
    this.nodes = this.nodes.splice(this.nodes.indexOf(node),1);
  }
  getNodes(){
    return this.nodes;
  }
  
  //====================
  // EDGE FUNCTIONS
  //====================
  createEdge(startNode, endNode, name=false){
    let id = this.getNextId('edge');
    if(name == false){
      name = id;
    }
    let edge = new Edge(id, name, startNode, endNode, 1, 10);
    this.edges.push(edge);
    return edge;
  }
  addEdge(edge){
    this.edges.push(edge);
  }
  removeEdge(edge){
    this.edges = this.edges.splice(this.edges.indexOf(edge),1);
  }
  getEdges(){
    return this.edges;
  }
  getEdgeBetween(current, node){
    return this.edges.find( (el) => {
      return ( 
        (el.getNodes()[0].id == current.id && el.getNodes()[1].id == node.id)
        ||
        (el.getNodes()[0].id == node.id && el.getNodes()[1].id == current.id)
      );
    });
  }
  
  //===================
  // UTILITY FUNCTIONS
  //===================
  getNextId(type='edge'){
    switch(type){
      case 'edge':
      default:
        return 'e' + this.edges.length + 1;
      break;
      case 'node':
        return 'n' + this.nodes.length;
      break;
    }
  }
  
  //====================
  // TRAVERSAL FUNCTIONS
  //====================
	traverse(start, end, algo='A*'){
		switch(algo){
			case 'A*':
			default:
				return this.aStar(start, end, this.h);
			break;
			case 'bfs':
				return this.bfs(start, end);
			break;
		}
	}

	aStar(start, end, h)
	{
		let explored = [];
		let openSet = new Set();
		openSet.add(start);
		let cameFrom = new Map();
		
		let gScore = new Map();
		gScore.set(start,0);
		let fScore = new Map();//with default value of Infinity
		fScore.set(start,this.h(start));
		console.log('fScoreSet',start, this.h(start));
		
		while(openSet.size !== 0)
		{
		//current = Math.min(...fScore);
		//let [keys, scores] = fScore.entries();
		/*let scores = fScore.values();
		console.log('scores',scores);
		let keys = fScore.keys();
		let minScore = Math.min(scores);
		console.log('minscore',minScore);
		current = keys[scores.indexOf(minScore)];
		*/

		let scores = Array.from(fScore.values());
		let minScore = Math.min.apply(null, scores.filter(Boolean));
		let keys = fScore.keys();
		let current = keys[scores.indexOf(minScore)];
		console.log('current', current);
		
		/*
		let iterVals = nodes.values();
		let vals = Array.from(iterVals);
		console.log(vals);
		let minVal = Math.min.apply(null, vals.filter(Boolean));
		console.log(minVal);
		*/

		
		if(current == end){
			return this.recreatePath(cameFrom, current);
		}
		
		openSet.delete(current);
		current.getNeighbours().forEach( (n) => {
			let e = this.getEdgeBetween(current, n);
			let tentativeGScore = gScore.set(current, e.flow);
			if(tentativeGScore < gScore.get(n)){
				cameFrom.set(n,current);
				gScore.set(n,tentativeGScore);
				fScore.set(n,tentativeGScore + this.h(n, current));
				if(!openSet.includes(n)){
					openSet.add(n);
				}
			}
		});
		}
		//REACHED THIS POINT WITHOUT PATH REACHING end - EXIT false
		return false;
	}

	/**
	 * Breadth-first search of this graph.
	 * @param {array} adj The array of edges.
	 * @param {Node} s The start node.
	 * @param {Node} e The end node.
	 */
	bfs(s, e) {
		let path = '';
		let queue = [];
		let visited = Array(this.nodes.length).fill(false);
		queue.push(s);
		while(queue.length){
			let curr = queue.shift();
			path += curr.id + ' ';
			//console.log('in bfs', curr.id);
			if(e.id && (curr.id == e.id)){
				//console.log(path);
				return path;
			}
			let n = curr.getNeighbours();
			for(let i = 0; i < n.length; i++){
				let neighbour = n[i];
				if(!visited.includes(neighbour)){
					visited.push(neighbour);
					neighbour.parent = curr;
					queue.push(neighbour);
				}
			}
		}
	}

	bfsCopies(adj, s, e){
		//Source: https://www.geeksforgeeks.org/breadth-first-search-or-bfs-for-a-graph/

		let nodeCount = this.nodes.length;
		const visited = Array(nodeCount).fill(false); 
		const queue = []; 
	
		// Mark the source node as visited 
		// and enqueue it
		visited[s] = true;
		queue.push(s);
	
		// Iterate over the queue
		while (queue.length) {
		
			// Dequeue a vertex from queue and print it
			const curr = queue.shift();
			//process.stdout.write(curr + " ");
			console.log(curr);
			//If we have reached the end of the search
			if(curr.id == e.id) return true;

			// Get all adjacent vertices of the dequeued 
			// vertex. If an adjacent has not been visited, 
			// mark it visited and enqueue it
			for (const x of adj[curr]) {
				if (!visited[x]) {
					visited[x] = true;
					queue.push(x);
				}
			}
		}
	}

	h(current, node=false){
		if(!node) return node;
		console.log('h', current, node);
		let edge = this.getEdgeBetween(current, node);
		return edge.getWeight();
	}
	
	recreatePath(cameFrom, current){
		let path = current;
		while(Object(cameFrom).keys.includes(current)){
			current = cameFrom[current];
			path.unshift(current);
		}
		return path;
	}
}

/* JS Ref
map()
	clear
	delete
	entries
	get
	has
	keys
	set
	values

set()
	add
	clear
	delete
	difference
	entries
	forEach
	has
	intersection
	keys
	values

*/

class Edge 
{
	id = '';
	name = '';
	start = null;
	end = null;
	flow = 1;
	capacity = 10;
	units = [];
	
	constructor(id, name, start, end, flow=1, capacity=10){
		this.id = id;
		this.name = name;
		this.start = start;
		this.end = end;
		this.flow = flow;
		this.capacity = capacity;
		start.edges.push(this);
		end.edges.push(this);
	}
	
	getNodes(){
		return [this.start, this.end];
	}
	
	getOtherNode(node){
		let [start, end] = this.getNodes();
		//console.log('inOtherNode',start,end);
		if(start.id == node.id){
			return end;
		}
		return start;
	}
	
	addUnit(unit){
		if(this.capacity==0) return false;
		this.units.push(unit);
		this.capacity -= 1;
		return true;
	}
	
	removeUnit(unit){
		this.units = this.units.splice(this.units.indexOf(unit), 1);
		this.capacity += 1;
		return true;
	}
	
	getWeight(){
		return (this.capacity * this.flow);
	}
}

class Node 
{
	id = '';
	name = '';
	edges = [];
	
	constructor(id, name, edges = []){
		this.id = id;
		this.name = name;
		this.edges = edges;
	}
	
	joinTo(newNode, twoWay = false)
	{
		let outEdge = new Edge(this, newNode, 1, 1);
		this.edges.push(outEdge);
		
		if(twoWay){
			let inEdge = new Edge(newNode, this, 1, 1);
			newNode.edges.push(inEdge);
		}
	}
	
	getEdges()
	{
		return this.edges;
	}
	
	getNeighbours(){
		let neighbours = [];
		for(let n in this.edges){
			let edge = this.edges[n];
			let otherNode = edge.getOtherNode(this);
			if(!neighbours.includes(otherNode)){
				neighbours.push(otherNode);
			}
		}
		return neighbours;
	}
}

let graph = new Graph();

/*
let home = graph.createNode('home');
let work = graph.createNode('work');
graph.createEdge(home, work);

console.log('home/work nodes',graph.getNodes());
console.log('home/work edges',graph.getEdges());
*/
let verticalStreets = ['North', 'Northmid', 'Middle', 'Southmid', 'South'];
let horizonalStreets = ['1st', '2nd', '3rd', '4th', '5th'];

for(let i = 0; i < verticalStreets.length; i++){
	
	for(let j = 0; j < horizonalStreets.length; j++){
	
		let intersectionName = verticalStreets[i] + '-' + horizonalStreets[j];
		let intersection = graph.createNode(intersectionName);
		
		if(j > 0){
		
			//GET PREVIOUS INTERSECTION (ONE ROW BACK?)
			let prevIndex = (i * 5) + (j - 1);
			let prevInt = graph.getNodes()[prevIndex];
			//ADD ROAD FROM i,j => i,j-1
			let road = graph.createEdge(intersection, prevInt, verticalStreets[i] + ' between ' + horizonalStreets[j - 1] + ' and ' + horizonalStreets[j]);
		}
		
		if(i > 0){
		
			//GET PREVIOUS INTERSECTION (ONE COLUMN BACK)
			let prevInt = graph.getNodes()[graph.getNodes().length - 2];
			//ADD ROAD FROM i,j => i,j-1
			let road = graph.createEdge(intersection, prevInt, horizonalStreets[j] + ' between ' + verticalStreets[i - 1] + ' and ' + verticalStreets[i]);
	}
	}
}



console.log('intersects',graph.getNodes());
console.log('roads',graph.getEdges());


let startNode = graph.getNodes()[0];
let endNode = graph.getNodes()[graph.getNodes().length - 1];
let startEdge = graph.getEdgeBetween(startNode, graph.getNodes()[1]);
let otherNode = startEdge.getOtherNode(startNode);

//OUTPUT EDGES AND NODES FOR TESTING
console.log('startEdge', startEdge);
console.log('startNeighbours', startNode.getNeighbours());
console.log('otherNode',otherNode);
console.log('ebtwn', startEdge);

//TESTING ALGOs
console.log('bfs',graph.traverse(startNode, endNode, 'bfs'));
console.log('astar', graph.traverse(startNode, endNode));

class Traversal {
  constructor(){
    
  }
  dfs(graph, start, end, explored=[]){
    /*procedure DFS(G, v) is
    label v as explored
    for all edges e in G.incidentEdges(v) do
        if edge e is unexplored then
            w ← G.adjacentVertex(v, e)
            if vertex w is unexplored then
                label e as a discovered edge
                recursively call DFS(G, w)
            else
               label e as a back edge
    */
    let exploredNodes = start; 
    start.getEdges().forEach( (e) => {
      //
      if(explored.indexOf(e) == false){
        
      }
    });
  }
}

/*
// The graph
const adjacencyList = new Map();

// Add node
function addNode(vertex) {
    adjacencyList.set(vertex, []);
}

// Add edge, undirected
function addEdge(origin, destination) {
    adjacencyList.get(origin).push(destination);
    adjacencyList.get(destination).push(origin);
}

// Create the Graph
vertexes.forEach(addNode);
//edges.forEach(route => addEdge(...route))
edges.forEach(edge => addEdge(edge.start, edge.finish));

console.log(adjacencyList);
*/
