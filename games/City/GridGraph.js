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
        
      }
    }

    //DRAW THE |_ OF A EACH GRID SQUARE |_| 
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < colCount; col++) {
        
        //All rows/cols - add intersection
        let name = 'grid[' + row + ',' + col + ']';
        let intersection = this.createNode(name);
        //console.log(name, row, col);
        
        //start as bottom right (row,col)
        //bL = same row, col - 1
        //tR = prev row, col 
        //left = bR -> bL
        //up = bR -> tR
        //let tL = 'grid[' + row + ',' + (col-1) + ']';
        
        let bR = 'grid[' + (row) + ',' + (col) + ']';
        let tR = 'grid[' + (row-1) + ',' + col + ']';
        let bL = 'grid[' + (row) + ',' + (col - 1) + ']';
        
        //DRAW LEFT AND UP
        if( (row == 0) && (col == 0) ){
          //Draw no edges 
          
        }else if(row == 0){
          if(col > 0){
            //Draw left only 
            let left = this.createEdge(this.getNodeByName(bL), this.getNodeByName(bR));
            //console.log('addLeft', row, col, bL, bR);
            //console.log(row, col,'left', left.id);
          }
        }else if(col == 0){
          if(row > 0){
            //Draw up only
            let up = this.createEdge(this.getNodeByName(bR), this.getNodeByName(tR));
            //console.log('addUp', row, col, bR, tR);
            //console.log(row, col,'up', up.id);
          }
        }else{
          //BOTH LEFT AND UP
          let left = this.createEdge(this.getNodeByName(bL), this.getNodeByName(bR));
          
          let up = this.createEdge(this.getNodeByName(bR), this.getNodeByName(tR));
          //console.log(row, col,'up+left', left.id, up.id);
        }
      }
    }
  }
}
