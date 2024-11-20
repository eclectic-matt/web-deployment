class Edge 
{
	id = '';
	name = '';
	start = null;
	end = null;
	flow = 1;
	capacity = 10;
	units = [];
	
	constructor(id, name, start, end, flow=1, capacity=10){
	  //console.log('edgeConstr',start,end);
		this.id = id;
		this.name = name;
		this.start = start;
		this.end = end;
		this.flow = flow;
		this.capacity = capacity;
		this.calcWeight();
		start.edges.push(this);
		end.edges.push(this);
	}
	
	getNodes(){
		return [this.start, this.end];
	}
	
	getOtherNode(node){
		let [start, end] = this.getNodes();
		//console.log('inOtherNode',start,end);
		if(start.id == node.id){
			return end;
		}
		return start;
	}
	
	addUnit(unit){
		if(this.capacity==0) return false;
		this.units.push(unit);
		this.capacity -= 1;
		this.calcWeight();
		return true;
	}
	removeUnit(unit){
		this.units = this.units.splice(this.units.indexOf(unit), 1);
		this.capacity += 1;
		this.calcWeight();
		return true;
	}
	
	getWeight(){
	  return this.weight;
	}
	calcWeight(){
		this.weight = (this.capacity * this.flow);
	}
}