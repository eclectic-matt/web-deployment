class Graph 
{
	id = '';
	name = '';
	nodes = [];
	edges = [];
	streetNames = [
	  'Main',
	  'Downtown',
	  'High',
	  'Low',
	  'Old',
	  'New',
	  'Ship',
	  'Port',
	  'Harbour',
	  'Long',
	  'Little',
	  'Butcher',
	  'Baker',
	  'Fish',
	  'Market',
	  'King',
	  'Queen',
	  'Crown',
	  'Prince',
	  'Princess',
	  'Earl',
	  'Duke',
	  'Oak',
	  'Birch',
	  'Elm',
	  'Willow',
	  'Pine'
	];
	streetTypes = [
	  'Avenue',
	  'Road',
	  'Lane',
	  'Street',
	  'Way',
	  'Court',
	  'Close'
	];
	
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
	getNodeById(nodeId){
		return this.nodes.find( (node) => node.id == nodeId);
	}
	getNodeByName(name){
	  return this.nodes.find( (node) => node.name == name); 
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
	
	getNewStreetName()
	{
	  //Remove a streetName from the list and append a random street type
	  return (this.streetNames.shift() + ' ' + this.streetTypes[Math.floor(Math.random() * this.streetTypes.length)]);
	}

	//===================
	// UTILITY FUNCTIONS
	//===================
	getNextId(type='edge')
	{
		switch(type){
			case 'edge':
			default:
				return 'e' + this.edges.length;
			break;
			case 'node':
				return 'n' + this.nodes.length;
			break;
		}
	}
	
	//====================
	// TRAVERSAL FUNCTIONS
	//====================
	traverse(start, end, algo='A*')
	{
		switch(algo){
			case 'bfs':
				return this.bfs(start, end);
			break;
			case 'dfs':
			  return this.dfs(start, end);
			break;
			case 'A*':
			default:
				return this.aStar(start, end, this.h);
			break;
		}
	}

	aStar(start, end, h)
	{
		let explored = [];
		let openSet = new Set();
		openSet.add(start.id);
		let cameFrom = new Map();
		
		let gScore = new Map();
		gScore.set(start.id,0);
		let fScore = new Map();//with default value of Infinity
		fScore.set(start.id,this.h(start));
		//console.log('fScoreSet',start.id, this.h(start));
		
		while(openSet.size !== 0)
		{
			let scores = Array.from(fScore.values());
			//console.log('scores',scores);
			//let minScore = Math.min.apply(null, scores.filter(Boolean));
			let minScore = Math.min(scores);
			//console.log('minScore',minScore);
			let keys = Array.from(fScore.keys());
			//console.log('keys', keys);
			
			let currentKey = keys[scores.indexOf(minScore)];
			//console.log('currentKey', currentKey);
			let current = this.getNodeById(currentKey);
			//console.log('current', current);
			
			if(current.id == end.id){
				return this.recreatePath(cameFrom, current.id);
			}
			
			openSet.delete(current.id);
			current.getNeighbours().forEach( (n) => {
				let e = this.getEdgeBetween(current, n);
				
				let tentativeGScore = e.flow;
				gScore.set(current.id, e.flow);
				console.log('tentative',current.id, tentativeGScore);
				
				if(tentativeGScore < gScore.get(n.id)){
					cameFrom.set(n.id,current);
					gScore.set(n.id, tentativeGScore);
					fScore.set(n.id, tentativeGScore + this.h(n, current));
					
					if(!openSet.includes(n.id)){
						openSet.add(n.id);
						console.log('openSetAdded', n.id);
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
	bfs(s, e=false) {
		let path = [];
		let queue = [];
		let visited = Array(this.nodes.length).fill(false);
		queue.push(s);
		while(queue.length){
			let curr = queue.shift();
			//path += curr.id + ' ';
			path.push(curr);
			//console.log('in bfs', curr.id);
			if(e.id && (curr.id == e.id)){
				//console.log(path);
				return this.recreatePath(path, curr.id);
				//return path;
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
	
	
	
	h(current, node=false){
		if(!node) return 0;
		console.log('h', current, node);
		let edge = this.getEdgeBetween(current, node);
		return edge.getWeight();
	}
	
	
}