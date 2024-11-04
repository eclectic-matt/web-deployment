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
	getNewStreetName()
	{
		//Remove a streetName from the list and append a random street type
		return (this.streetNames.shift() + ' ' + this.streetTypes[Math.floor(Math.random() * this.streetTypes.length)]);
	}
}
