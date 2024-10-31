const handleParams = (form) => {
  //console.log(document.getElementById('gridSize').value, document.getElementById('algorithm').value);
  init();
  return false;
}
var timers = [];
 
function init(){
  clearTimers(timers);
  //console.log(document.getElementById('gridSize').value, document.getElementById('algorithm').value);
  let algorithm = document.getElementById('algorithm').value;
  let gridSize = document.getElementById('gridSize').value;
  
  let rows = cols = parseInt(gridSize);
  let startId = document.getElementById('startNodeId').value;
  let endId = document.getElementById('endNodeId').value;
  let sIdx = document.getElementById('startNodeId').selectedIndex;
  let eIdx = document.getElementById('endNodeId').selectedIndex;
  
  let delayMs = parseFloat(document.getElementById('delayS').value) * 1000;
  //console.log('delayS',document.getElementById('delayS').value);
  
  let graph = new GridGraph(rows, cols, 'gridGraph');
  
  //Remove a couple of edges at random?
  /*
  graph.edges.splice(22,1);
  graph.edges.splice(39,1);
  */
  
  const totalNodes =  (rows*cols);
  const totalEdges = ((rows-1)*(rows))+((cols-1)*(cols));
  
  //console.log('Generating a',rows,'by',cols,'grid graph = ',totalNodes,' nodes and',totalEdges,'edges');
  
  //console.log('nodes', graph.getNodes());
  //console.log('edges', graph.getEdges());
  
  let startNode = graph.getNodes()[0];
  let endNode = graph.getNodes()[graph.getNodes().length - 1];
  
  if(startId !== ''){
    startNode = graph.getNodeById(startId);
  }
  if(endId !== ''){
    endNode = graph.getNodeById(endId);
  }
  
  let path = new Set();
  let distances = [];
  //TESTING ALGOs
  //dfs => works but output wrong
  //bfs => nope
  //djikstra => nope
  //algo = 'dfs';
  switch(algorithm){
    case 'bfs':
      //console.log('bfs from',startNode.id,'to',endNode.id,'=>');
      [ path ] = Traversal.bfs(graph, startNode, endNode);
      //console.log('bfs path', Array.from(path.values()).join(','));
      Traversal.outputPath(graph, path, false, delayMs);
    break;
    case 'dfs':
      //console.log('dfs from',startNode.id,'to',endNode.id,'=>');
      [ path ] = Traversal.dfs(graph, startNode, endNode);
      Traversal.outputPath(graph, path, false, delayMs);
    break;
    case 'dijkstra':
      //console.log('djikstra from', startNode.id,'to',endNode.id,'=>');
      [ path, distances ] = Traversal.djikstra(graph, startNode, endNode);
      Traversal.outputPath(graph, path, distances, delayMs);
      
      //Also search from one to another 
      /*let nodeOne = graph.getNodeById('n1');
      let nodePenultimate = graph.getNodeById('n' + (graph.nodes.length - 2));
      console.log('djikstra from', nodeOne.id,'to',nodePenultimate.id,'=>');
      Traversal.djikstra(graph, nodeOne, nodePenultimate);*/
    break;
  }

  updateNodeIds(gridSize, sIdx, eIdx);
}

function updateNodeIds(size, s=0, e=-1){
  let startNodeSelect = document.getElementById('startNodeId');
  let endNodeSelect = document.getElementById('endNodeId');
  startNodeSelect.innerHTML = null;
  endNodeSelect.innerHTML = null;
  for(let i = 0; i < (size*size); i++){
    let opt1 = document.createElement('option');
    opt1.value = 'n' + i;
    opt1.innerHTML = 'n' + i;
    startNodeSelect.appendChild(opt1);
    let opt2 = document.createElement('option');
    opt2.value = 'n' + i;
    opt2.innerHTML = 'n' + i;
    endNodeSelect.appendChild(opt2);
  }
  //startNodeSelect.selectedIndex = 0;
  startNodeSelect.selectedIndex = s;
  //endNodeSelect.selectedIndex = endNodeSelect.children.length - 1;
  if(e === -1){
    endNodeSelect.selectedIndex = endNodeSelect.children.length - 1;
  }else{
    endNodeSelect.selectedIndex = e;
  }
  //console.log(startNodeSelect, endNodeSelect);
}

function clearTimers(timers){
  for(let timer of timers){
    clearTimeout(timer);
  }
  window.timers = [];
}
