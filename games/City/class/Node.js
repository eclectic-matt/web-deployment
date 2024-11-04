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
	
	getNeighbours()
	{
	  let self = this;
	  //INIT NEIGHBOURS
		let neighbours = [];
		//FOR EACH EDGE
		for(let n in this.edges){
		  //GET THE CURRENT EDGE
			let edge = this.edges[n];
			//console.log('nEdge',edge,self);
			//GET THE OTHER NODE (NOT THIS)
			let otherNode = edge.getOtherNode(self);
			//IF THIS WASN'T ALREADY A NEIGHBOUR
			if(!neighbours.includes(otherNode)){
			  //ADD TO THE NEIGHBOURS
				neighbours.push(otherNode);
			}
		}
		//RETURN THE NEIGHBOURS
		return neighbours;
	}
}
