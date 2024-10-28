class GridGraph extends Graph 
{
  rows = 0;
  cols = 0;
  constructor(rowCount, colCount, name = false)
  {
    if (!name) {
      name = 'grid';
    }
    super(name, name + 'Graph');
    this.rows = rowCount;
    this.cols = colCount;
    /*let rowStreets = Array.fill(rowCount);
    let colStreets = Array.fill(colCount);*/
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        let name = 'grid[' + row + ',' + col + ']';
        let intersection = this.createNode(name);
      }
    }
  
    //DRAW THE |_ OF A EACH GRID SQUARE |_| 
    for (let row = 1; row < rowCount; row++) {
      for (let col = 1; col < colCount; col++) {
        //DRAW THE LEFT AND BOTTOM LINES OF A GRID SQUARE - will draw the final top and right lines at the end
        //let tR = 'grid[' + row + ',' + col + ']';
        let tL = 'grid[' + row + ',' + (col - 1) + ']';
        let bL = 'grid[' + (row - 1) + ',' + (col - 1) + ']';
        let bR = 'grid[' + (row - 1) + ',' + col + ']';
        //CREATE TOP/BOTTOM EDGES
        let left = this.createEdge(this.getNodeByName(tL), this.getNodeByName(bL));
        let bottom = this.createEdge(this.getNodeByName(bL), this.getNodeByName(bR));
      }
    }
  
    //ADD RIGHT-HAND EDGES
    for (let row = 0; row < (rowCount-1); row++) {
      let tR = 'grid[' + (row + 1) + ',' + (colCount - 1) + ']';
      let bR = 'grid[' + (row) + ',' + (colCount - 1) + ']';
      let right = this.createEdge(this.getNodeByName(tR), this.getNodeByName(bR));
    }
  
    //ADD TOP EDGES
    for (let col = 0; col < (colCount-1); col++) {
      let tR = 'grid[' + (rowCount - 1) + ',' + (col + 1) + ']';
      let tL = 'grid[' + (rowCount - 1) + ',' + col + ']';
      let top = this.createEdge(this.getNodeByName(tR), this.getNodeByName(tL));
    }
  }
}