class MapGenerator 
{
  #nodeTypes = [
    'chest',    // 0
    'battle',   // 1
    'event',    // 2
    'merchant', // 3
    'boss'      // 4
  ];
  
  constructor()
  {
    
  }
  
  /*
   * Maps are a set of paths from left to right
   * Paths split/join between nodes, but the player always moves from left to right
   * hNodes = the number of horizonal nodes
   * vNodes = the number of vertical nodes at the tallest point
   *
   *        3           0
   *    1       6       25
   * 0      4       8   50
   *    2       7       75
   *        5           100
   * 0  25  50  75  100
   */
  generateMap(hNodes = 5, vNodes = 3)
  {
    let nodeMap = [];
    let nodeType = 0; // start with chest
    //Hard coding initial map
    let node0 = {
      id: 0,
      x: 0,
      y: 50,
      type: 0,
      connections: [1, 2]
    };
    nodeMap.push(node0);
    nodeType = this.getRandomNode(0,3);
    let node1 = {
      id: 1,
      x: 25,
      y: 25,
      type: nodeType,
      connections: [3, 4]
    };
    nodeMap.push(node1);
    nodeType = this.getRandomNode(0,3);
    let node2 = {
      id: 2,
      x: 25,
      y: 75,
      type: nodeType,
      connections: [4, 5]
    };
    nodeMap.push(node2);
    nodeType = this.getRandomNode(0,3);
    let node3 = {
      id: 3,
      x: 50,
      y: 0,
      type: nodeType,
      connections: [6]
    };
    nodeMap.push(node3);
    nodeType = this.getRandomNode(0,3);
    let node4 = {
      id: 4,
      x: 50,
      y: 50,
      type: nodeType,
      connections: [6, 7]
    };
    nodeMap.push(node4);
    nodeType = this.getRandomNode(0,3);
    let node5 = {
      id: 5,
      x: 50,
      y: 100,
      type: nodeType,
      connections: [7]
    };
    nodeMap.push(node5);
    nodeType = this.getRandomNode(0,3);
    let node6 = {
      id: 6,
      x: 25,
      y: 75,
      type: nodeType,
      connections: [8]
    };
    nodeMap.push(node6);
    nodeType = this.getRandomNode(0,3);
    let node7 = {
      id: 7,
      x: 75,
      y: 75,
      type: nodeType,
      connections: [8]
    };
    nodeMap.push(node7);
    nodeType = this.getRandomNode(0,3);
    let node8 = {
      id: 8,
      x: 100,
      y: 50,
      type: nodeType,
      connections: []
    };
    nodeMap.push(node8);
    return nodeMap;
  }
  
  outputMap(target, map)
  {
    target.innerHTML = null;
    let targetW = target.width;
    let targetH = target.height;
    let nodeRadius = targetW / 15;
    //First pass, output points
    for(let i = 0; i < map.length; i++)
    {
      let node = map[i];
      let div = document.createElement('div');
      div.classList.add('map-node');
      div.classList.add(this.#nodeTypes[node.type]);
      div.id = 'node' + node.id;
      //Calculate top/left
      let top = (node.x / 100) * targetW;
      top += target.top;
      div.style.top = top;
      let left = (node.y / 100) * targetH;
      left += target.left;
      div.style.left = left;
      target.appendChild(div);
    }
    //Second pass, output connections
    for(let i = 0; i < map.length; i++)
    {
      let node = map[i];
      for(let c = 0; c < node.connections.length; c++)
      {
        let line = document.createElement('hr');
        let eNodeId = node.connections[c];
        line.id = 'connect-' + node.id + '-' + eNodeId;
        console.log(line.id);
        line.classList.add('map-line');
        let sNode = node;
        let eNode = map[eNodeId];
        //Calculate line data
        /*let midpoint = this.getMidpoint(sNode, eNode);
        line.style.top = midpoint.y;
        line.style.left = midpoint.x;*/
        line.style.top = (node.y / 100) * targetH;
        line.style.left = (node.x / 100) * targetW;
        let angle = this.getAngleBetween(sNode, eNode);
        line.style.transform = 'rotate(' + angle + 'deg)';
        let distance = this.getDistanceBetween(sNode, eNode);
        line.style.width = distance + 'px';
        target.appendChild(line);
      }
    }
  }
  
  getDistanceBetween(sNode, eNode)
  {
    let yDiff = eNode.y - sNode.y;
    let yDiffSq = yDiff * yDiff;
    let xDiff = eNode.x - sNode.x;
    let xDiffSq = xDiff * xDiff;
    // √( (y2 - y1)^2 + (x2 - x1)^2 )
    return Math.sqrt(yDiffSq + xDiffSq);
  }
  
  getAngleBetween(sNode, eNode)
  {
    let yDiff = eNode.y - sNode.y;
    let xDiff = eNode.x - sNode.x;
    //Calculate in radians (-PI, +PI)
    let theta = Math.atan2(yDiff, xDiff);
    //Convert to degrees
    theta *= 180 / Math.PI;
    return theta;
  }
  
  getMidpoint(sNode, eNode)
  {
    //Return as {x,y} object
    return {
        x: (sNode.x + eNode.x) / 2,
        y: (sNode.y + eNode.y) / 2
    };
}
  
  getRandomNode(min = 0, max = 4)
  {
    return Math.floor(min + (Math.random() * (max - min)));
  }
}