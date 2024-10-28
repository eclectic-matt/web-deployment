function init(){

let rows = 7;
let cols = 7;
let graph = new GridGraph(rows, cols, 'gridGraph');
console.log('Generating a',rows,'by',cols,'grid graph = ', (rows*cols) + ' nodes and',((rows-1)*(rows))+((cols-1)*(cols)),'edges');

/*
let graph = new Graph('graph', 'simple');
let start = graph.createNode('start');
let mid = graph.createNode('mid');
let smEdge = graph.createEdge(start, mid, 'smEdge');
let end = graph.createNode('end');
let meEdge = graph.createEdge(mid, end, 'meEdge');
*/



console.log('nodes', graph.getNodes());
console.log('edges', graph.getEdges());

let startNode = graph.getNodes()[0];
let endNode = graph.getNodes()[graph.getNodes().length - 1];
let startEdge = graph.getEdgeBetween(startNode, graph.getNodes()[1]);
let otherNode = startEdge.getOtherNode(startNode);
let middleNode = graph.getNodes()[Math.floor(graph.getNodes().length / 2)];

//OUTPUT EDGES AND NODES FOR TESTING
console.log('startNode', startNode);
console.log('startEdge', startEdge);
console.log('startNeighbours', startNode.getNeighbours());

console.log('middleNode', middleNode);
console.log('middleNeighbours', middleNode.getNeighbours());

console.log('endNode', endNode);

console.log('otherNode',otherNode);
console.log('ebtwn', startEdge);
console.log('nodeById',graph.getNodeById('n8'));
console.log('graph', graph.nodes);

//Traversal.outputGraph(graph);

//TESTING ALGOs
algo = 'bfs';
switch(algo){
  case 'bfs':
    console.log('bfs from',startNode.id,'to',endNode.id,'=>',Traversal.bfs(graph, startNode, endNode));
  break;
  case 'dfs':
    console.log('dfs from',startNode.id,'to',endNode.id,'=>',Traversal.dfs(graph, startNode, endNode));
  break;
  case 'dijkstra':
    console.log('djikstra from', startNode.id,'to',endNode.id, Traversal.djikstra(graph, startNode, endNode));
  break;
}

//console.log('astar', graph.traverse(startNode, endNode));

/*

console.log('graph', graph.nodes);
*/

/*
let unitCounter = 0;
//add some traffic
for(let i = 0; i < graph.getEdges().length; i++){
  //Add between 1-10 units to this edge
  let edge = graph.getEdges()[i];
  let unitsToAdd = Math.floor(Math.random() * 3);
  for(let j = 0; j < unitsToAdd; j++){
    let unit = { 'id': unitCounter };
    edge.addUnit(unit);
    unitCounter++;
  }
}

console.log('djikstra traffic from', startNode.id,'to',endNode.id, Traversal.djikstra(graph, startNode, endNode));
*/


/*
let cnv = document.getElementById('graphs');
Traversal.drawGraph(graph, cnv, {rowSize:rows, colSize:cols});
*/
// Allows inheritance of static properties
//Object.getPrototypeOf(GridGraph) === Graph;
// Allows inheritance of instance properties
//Object.getPrototypeOf(GridGraph.prototype) === Graph.prototype;

//#-#-#-#-#-#-#-#-#-#-#-#-#-#-#
// TESTING
//#-#-#-#-#-#-#-#-#-#-#-#-#-#-#


/*
let verticalStreets = ['North', 'Northmid', 'Middle', 'Southmid', 'South'];
let horizontalStreets = ['1st', '2nd', '3rd', '4th', '5th'];

let graph = new Graph();

for(let i = 0; i < horizontalStreets.length; i++){
	
	for(let j = 0; j < verticalStreets.length; j++){
	
	  //ADD THE INTERSECTION HERE
		let intersectionName = horizontalStreets[i] + '-' + verticalStreets[j];
		let intersection = graph.createNode(intersectionName);
		
		//If on the 1st+ row
		if(j > 0){
			//GET PREVIOUS INTERSECTION (ONE ROW BACK?)
			let prevIndex = (i *  horizontalStreets.length) + (j - 1);
			let prevInt = graph.getNodes()[prevIndex];
			//ADD ROAD FROM i,j => i,j-1
			let road = graph.createEdge(intersection, prevInt, horizontalStreets[i] + ' between ' + verticalStreets[j - 1] + ' and ' + verticalStreets[j]);
		}
		
		//If on the 1st+ column
		if(i > 0){
			//GET PREVIOUS INTERSECTION (ONE COLUMN BACK)
			let prevInt = graph.getNodes()[graph.getNodes().length - 2];
			//ADD ROAD FROM i,j => i,j-1
			let road = graph.createEdge(intersection, prevInt, verticalStreets[j] + ' between ' + horizontalStreets[i - 1] + ' and ' + horizontalStreets[i]);
	  }
	}
}

console.log('intersects',graph.getNodes());
console.log('roads',graph.getEdges());
*/

}