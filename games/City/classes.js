function init(){

	let rows = 3;
	let cols = 3;
	let graph = new GridGraph(rows, cols, 'gridGraph');
	console.log('Generating a',rows,'by',cols,'grid graph = ', (rows*cols) + ' nodes and',((rows-1)*(rows))+((cols-1)*(cols)),'edges');
	console.log('nodes', graph.getNodes());
	console.log('edges', graph.getEdges());

	let startNode = graph.getNodes()[0];
	let endNode = graph.getNodes()[graph.getNodes().length - 1];

	/*
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
	*/

	//TESTING ALGOs
	algo = 'dfs';
	switch(algo){
		case 'bfs':
			console.log('bfs from',startNode.id,'to',endNode.id,'=>');
			Traversal.bfs(graph, startNode, endNode);
		break;
		case 'dfs':
			console.log('dfs from',startNode.id,'to',endNode.id,'=>');
			Traversal.dfs(graph, startNode, endNode);
		break;
		case 'dijkstra':
			console.log('djikstra from', startNode.id,'to',endNode.id,'=>');
			Traversal.djikstra(graph, startNode, endNode);
		break;
	}
}