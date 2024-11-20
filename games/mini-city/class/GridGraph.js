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

		//DRAW THE |_ OF A EACH GRID SQUARE |_| 
		for (let row = 0; row < rowCount; row++) {
			for (let col = 0; col < colCount; col++) {
				//All rows/cols - add intersection
				let name = 'grid[' + row + ',' + col + ']';
				this.createNode(name);
				
				//start as bottom right (row,col), left=[row,col]->[row,col-1], up=[row,col]->[row-1,col]
				let bR = 'grid[' + (row) + ',' + (col) + ']';
				let tR = 'grid[' + (row-1) + ',' + col + ']';
				let bL = 'grid[' + (row) + ',' + (col - 1) + ']';
				
				//DRAW LEFT AND UP
				if( (row == 0) && (col == 0) ){
					//Draw no edges 
				
				}else if(row == 0){
					if(col > 0){
						//Draw left only 
						this.createEdge(this.getNodeByName(bL), this.getNodeByName(bR));
					}
				}else if(col == 0){
					if(row > 0){
						//Draw up only
						this.createEdge(this.getNodeByName(bR), this.getNodeByName(tR));
					}
				}else{
					//BOTH LEFT AND UP
					this.createEdge(this.getNodeByName(bL), this.getNodeByName(bR));
					this.createEdge(this.getNodeByName(bR), this.getNodeByName(tR));
				}
			}
		}
	}
}
