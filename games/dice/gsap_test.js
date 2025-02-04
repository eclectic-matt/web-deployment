/**
 * REFERENCES, EXAMPLES AND SOURCES
 * https://gsap.com/community/forums/topic/16791-auto-scrolling-and-boundaries-with-clones/
 * https://gsap.com/community/forums/topic/11581-draggable-snap-to-grid-based-on-another-object/
 * https://gsap.com/community/forums/topic/27978-draggable-snap-to-target-spot/
 */


const jokers = document.querySelectorAll('.joker');
const jokerRow = document.getElementById('jokerRow');
const looseRow = document.getElementById('looseJokers');
let jokerOrder = [];
const leftPad = 20;
const topPad = 20;

jokers.forEach((item, i) => {

	Draggable.create(item, {
		
		//snap: calculateSnapPosition(jokerRow, item),
		
		onPress:()=>{
			//HIGHLIGHT SELECTED JOKER
			//gsap.to(item, {duration:0.1, scale:1.2, rotate:"10%", zIndex:100})
			if (Draggable.hitTest(item, jokerRow, "20%")) {
				//removeJokerFromRow(jokerRow, item);
				//let removeIndex = jokerOrder.find( (id) => { return id == item.id;});
				//jokerOrder.splice(removeIndex,1);
			}
		},

		onDrag:()=>{
			//if(Draggable.hitTest(item, jokerRow, "20%")){
				//gsap.to(jokerRow, {duration:0.1, scale: 1.0})
			//}
			//gsap.to(item, {duration:0.1, rotate:"10%", zIndex:100})
		},

		onRelease:()=>{ // return the item on release
		
			if(Draggable.hitTest(item, jokerRow, "50%")){
				
				//item.snap = calculateSnapPosition(jokerRow, item);
				
				//CALCULATE POSITION TO INSERT - YOU WILL INSERT AT INDEX n WHERE n = leftPad 
				let jokerCount = jokerOrder.length;
				let insertIndex = 0;
				var bounds = jokerRow.getBoundingClientRect();
				var rect = item.getBoundingClientRect();
					
				if(jokerCount > 0){
					for(let i = 0; i < jokerCount; i++){
						let leftLimit = bounds.x + ((i+1) * (leftPad + (rect.width / 2)));
						if(rect.x < leftLimit){
							insertIndex = i;
							break;
						}
					}
				}
				jokerOrder.splice(insertIndex, 0, item.id);
				drawCardsFromOrder(jokerRow, jokerOrder);
			}else{
				let removeIndex = jokerOrder.find( (id) => { return id == item.id;});
				jokerOrder.splice(removeIndex,1);
				drawCardsFromOrder(jokerRow, jokerOrder);
			}
		}
	})
})


drawCardsFromOrder(jokerRow, jokerOrder);

function drawCardsFromOrder(cardRow, jokerOrder)
{
	console.log('Draw cards from order to',cardRow.id,jokerOrder);
	let jokers = jokerOrder.map( (id) => {
		let joker = document.getElementById(id);
		return joker;
	});
	drawCardsToRow(cardRow, jokers);
}

//DRAW CARDS INITIALLY 
drawCardsToRow(looseRow, jokers);

/* this works as intended */
function drawCardsToRow(cardRow, cards)
{
	if(cards.length === 0) return false;
	console.log('Draw cards to',cardRow.id,Array.from(cards).map( (card) => { return card.id;}));
	const bounds = cardRow.getBoundingClientRect();
	cards.forEach( (card, index) => {
		//calculate position and animate to it
		const rect = card.getBoundingClientRect();
		const xPos = bounds.left + (index * (rect.width + leftPad));
		const yPos = bounds.top;
		console.log('Draw',card.id,'to position',xPos,yPos);
		gsap.set(card, { x: xPos, y: yPos});
		//
		//const xPos = bounds.left + (index * (rect.width + leftPad));
		//const yPos = bounds.top - rect.top;
		//console.log('Draw',card.id,'to position',xPos,yPos);
		//gsap.to(card, { left: xPos, top: yPos});
	})
}



function calculateSnapPosition(jokerRow, joker)
{
	let jokerCount = jokerOrder.length;
	let insertIndex = 0;
	var bounds = jokerRow.getBoundingClientRect();
	var rect = joker.getBoundingClientRect();
	
					
	if(jokerCount > 0){
		for(let i = 0; i < jokerCount; i++){
			let leftLimit = bounds.left + ((i+1) * (leftPad + (rect.width / 2)));
			if(rect.left < leftLimit){
				insertIndex = i;
				break;
			}
		}
	}
	let newX = bounds.left + leftPad + (insertIndex * (rect.width + leftPad));
	let newY = bounds.top + topPad;
	//jokerOrder.splice(insertIndex, 0, joker.id);
	//console.log(jokerCount, newX, newY, joker.id, jokerOrder);
	return { left: newX, left: newY };
}




function appendJokerToRow(jokerRow, item, previousJoker=null){
	let currentJokerCount = jokerRow.children.length;
	//let jokerRow = document.getElementById('jokerRow');
	//console.log(jokerRow);
	if(previousJoker){
		jokerRow.insertBefore(item, previousJoker);
	}else{
		jokerRow.appendChild(item);
	}
	var bounds = jokerRow.getBoundingClientRect();
	var rect = item.getBoundingClientRect();
	
	/*let newX = bounds.left - rect.left + (currentJokerCount * 75);
	//let newY = -(bounds.top - rect.top);
	let newY = bounds.top;
	//gsap.to(item, {duration:1, x:newX, y:newY});
	*/
	const leftPad = 20;
	const topPad = 20;
	let newX = bounds.left + leftPad + (currentJokerCount * (rect.width + leftPad));
	let newY = bounds.top + topPad;
	
	/*Draggable.get(item).set({
		snap: {
			x: newX,
			y: newY
		}
	});*/
	return {x: newX, y:newY};
	//redrawJokerRow();
}

function removeJokerFromRow(jokerRow, item){
	jokerRow.removeChild(item);
	//redrawJokerRow();
}


function redrawJokerRow(){
	let jokerCount = jokerRow.children.length;
	let centreX = Math.floor((jokerRow.offsetLeft + jokerRow.offsetWidth) / 2);
	let centreY = Math.floor((jokerRow.offsetTop + jokerRow.offsetHeight) / 2);
	let spreadX = 50;
	Array.from(jokerRow.children).forEach( (joker) => {
		//gsap.to(joker, {})
		//joker.style.zIndex =
		let jokerXPos = centreX - (spreadX * (jokerCount - 1));
		gsap.to(joker, {x: jokerXPos})
	})
}








var pad = 20;
var threshold = "50%";

var dragElements = document.querySelectorAll(".jokerRow");
var dropElements = document.querySelectorAll(".joker");

var dragTiles = Array.prototype.map.call(dragElements, createDragTile);
var dropTiles = Array.prototype.map.call(dropElements, createDropTile);

function createDragTile(element, index) {

	TweenLite.set(element, {
	  left: pad,
	  top: pad + index * (pad + element.offsetHeight)
	});
	
	var draggable = new Draggable(element, {
	  bounds: ".board",
	  onDragStart: onDragStart,
	  onDrag: onDrag,
	  onDragEnd: onDragEnd
	});
	
	var tile = {
	  element: element,
	  parent: null,   
	  value: element.dataset.value
	};
	
	function onDragStart() {    
	  element.classList.remove("correct", "wrong");
	}
	
	function onDrag() {
	  
	  var parent = tile.parent;
		  
	  if (parent) {
			  
		if (this.hitTest(parent.element, threshold)) {
		  
		  // exit the function
		  // tile is still hitting parent, so no need to proceed any further.
		  return;
		}
		
		// tile is no longer hitting parent, so clear any references between the two
		parent = tile.parent = parent.child = null;      
	  }
	  
	  for (var i = 0; i < dropTiles.length; i++) {
		
		var dropTile = dropTiles[i];
		
		if (dropTile.child) {
		  
		  // continue to next loop iteration
		  // drop tile already has a child, so no need to proceed any further
		  continue;
		}
		
		if (this.hitTest(dropTile.element, threshold)) {
		  
		  // we hit an empty drop tile, so link the two together and exit the function
		  tile.parent = dropTile;
		  dropTile.child = tile;
		  element.classList.add("hitting");
		  return;
		}
	  }
	  
	  // if we made it this far, we're not hitting an empty drop tile
	  element.classList.remove("hitting");
	}
	
	function onDragEnd() {
	  
	  var x = 0;
	  var y = 0;
	  
	  // move to parent
	  if (tile.parent) {
		
		var rect1 = element.getBoundingClientRect();
		var rect2 = tile.parent.element.getBoundingClientRect();
		
		x = "+=" + (rect2.left - rect1.left);
		y = "+=" + (rect2.top - rect1.top);
	  }
	  
	  TweenLite.to(element, 0.3, {
		x: x,
		y: y
	  });
	  
	}
	
	return tile;
  }
  
  function createDropTile(element, index) {
	
	TweenLite.set(element, {
	  left: pad + 3 * element.offsetWidth,
	  top: pad + index * (pad + element.offsetHeight)
	});
	
	var tile = {
	  element: element,
	  child: null,   
	  value: element.dataset.value
	};
	
	return tile;
  }





/*
//SOURCE: https://gsap.com/community/forums/topic/11581-draggable-snap-to-grid-based-on-another-object/
var D = Draggable.create("#box", {
type:"x,y",
throwProps:true, 
snap:{x:box2B.left-10, y:box2B.top-10}
});



//SOURCE: https://gsap.com/community/forums/topic/27978-draggable-snap-to-target-spot/
console.clear();

var pad = 20;
var threshold = "50%";

var checkButton = document.querySelector("#check-button");
var resetButton = document.querySelector("#reset-button");

var dragElements = document.querySelectorAll(".drag-tile");
var dropElements = document.querySelectorAll(".drop-tile");

var dragTiles = Array.prototype.map.call(dragElements, createDragTile);
var dropTiles = Array.prototype.map.call(dropElements, createDropTile);

checkButton.addEventListener("click", checkTiles);
resetButton.addEventListener("click", resetTiles);

function checkTiles() {
  
  for (var i = 0; i < dragTiles.length; i++) {
    
    var tile = dragTiles[i];
    
    if (!tile.parent) {
      continue;
    }
    
    var className = tile.value === tile.parent.value ? "correct" : "wrong";    
    tile.element.classList.add(className);    
  }
}

function resetTiles() {
  
  for (var i = 0; i < dragTiles.length; i++) {
    
    var tile = dragTiles[i];
    
    if (tile.parent) {
      tile.parent = tile.parent.child = null;
    }
    
    tile.element.classList.remove("correct", "wrong", "hitting");
    
    TweenLite.to(tile.element, 0.3, {
      x: 0,
      y: 0
    });
  }
}

function createDragTile(element, index) {
  
  TweenLite.set(element, {
    left: pad,
    top: pad + index * (pad + element.offsetHeight)
  });
  
  var draggable = new Draggable(element, {
    bounds: ".board",
    onDragStart: onDragStart,
    onDrag: onDrag,
    onDragEnd: onDragEnd
  });
  
  var tile = {
    element: element,
    parent: null,   
    value: element.dataset.value
  };
  
  function onDragStart() {    
    element.classList.remove("correct", "wrong");
  }
  
  function onDrag() {
    
    var parent = tile.parent;
        
    if (parent) {
            
      if (this.hitTest(parent.element, threshold)) {
        
        // exit the function
        // tile is still hitting parent, so no need to proceed any further.
        return;
      }
      
      // tile is no longer hitting parent, so clear any references between the two
      parent = tile.parent = parent.child = null;      
    }
    
    for (var i = 0; i < dropTiles.length; i++) {
      
      var dropTile = dropTiles[i];
      
      if (dropTile.child) {
        
        // continue to next loop iteration
        // drop tile already has a child, so no need to proceed any further
        continue;
      }
      
      if (this.hitTest(dropTile.element, threshold)) {
        
        // we hit an empty drop tile, so link the two together and exit the function
        tile.parent = dropTile;
        dropTile.child = tile;
        element.classList.add("hitting");
        return;
      }
    }
    
    // if we made it this far, we're not hitting an empty drop tile
    element.classList.remove("hitting");
  }
  
  function onDragEnd() {
    
    var x = 0;
    var y = 0;
    
    // move to parent
    if (tile.parent) {
      
      var rect1 = element.getBoundingClientRect();
      var rect2 = tile.parent.element.getBoundingClientRect();
      
      x = "+=" + (rect2.left - rect1.left);
      y = "+=" + (rect2.top - rect1.top);
    }
    
    TweenLite.to(element, 0.3, {
      x: x,
      y: y
    });
    
  }
  
  return tile;
}

function createDropTile(element, index) {
  
  TweenLite.set(element, {
    left: pad + 3 * element.offsetWidth,
    top: pad + index * (pad + element.offsetHeight)
  });
  
  var tile = {
    element: element,
    child: null,   
    value: element.dataset.value
  };
  
  return tile;
}
*/







function setJoker(slot, joker){
	//APPEND JOKER AS CHILD OF SLOT,
	//MOVING EXISTING JOKERS AS NEEDED
	if(slot.children.length > 0){
		let prev = slot.children[0];
		console.log('prev', prev);
		let newSlotId = addJokerSlot();
		nextSlot = document.getElementById(newSlotId);
		nextSlot.dataset.joker = slot.dataset.joker; 
		nextSlot.appendChild(prev);
		slot.removeChild(prev);
	}
	slot.appendChild(joker);
}





//=====
// old
//=====

function pickupJoker(jokerId){
	let jokerSlots = document.querySelectorAll('.jokerSlot');
	jokerSlots.forEach( (el) => {
		if(el.dataset.joker === jokerId){
			console.log('REMOVING ' + el.id);
			//CALL TO REMOVE ELEMENT NOW
			gsap.call(removeElement(el));
			//const emptySlot = document.getElementById(el.id);
			//emptySlot.remove();
		}
	});
}

function dropJoker(slotId, joker)
{
	let slot = document.getElementById(slotId);
	//CHECK FOR EXISTING JOKER IN THIS SLOT
	if(slot.dataset.joker){
		let nextSlotIndex = slotId.replace('jokerSlot','');
		let nextSlot = document.getElementById('jokerSlot' + (nextSlotIndex));
		//THIS JOKER WILL BE PUSHED RIGHT - CHECK EXISTS
		if(!nextSlot){
			//CREATE SLOT AND ADD JOKER TO IT
			let newSlotId = addJokerSlot();
			nextSlot = document.getElementById(newSlotId);
			nextSlot.dataset.joker = slot.dataset.joker;
		}else{
			nextSlot.dataset.joker = slot.dataset.joker;
		}
	}
	slot.dataset.joker = joker.id;
}
function redrawJokers(){
	
}

function removeElement(element) {
	if (typeof(element) === "string") {
		element = document.querySelector(element);
	}
	Draggable.get(element).kill();
	return function() {
		element.parentNode.removeChild(element);
	};
}


function cleanUpSlots(){
	//LOAD JOKER SLOTS AGAIN
	let jokerSlots = document.querySelectorAll('.jokerSlot');
	//NOW, RENAME SLOTS 1 - x
	jokerSlots.forEach( (el, i) => {
		//console.log('SLOT ' + el.id + ' RENAMED TO ' + 'jokerSlot' + (i + 1));
		el.id = 'jokerSlot' + (i + 1);
		el.innerHTML = 'slot' + (i + 1);
	});
}

function setJokerInSlot(slot, joker){
	let jokerSlots = document.querySelectorAll('.jokerSlot');
	jokerSlots.forEach( (el) => {
		if(	(el.dataset.joker === joker.id) && (el.id !== slot.id) ){
			//console.log('JOKER CLEARED FROM SLOT WITH ID ' + el.id);
			el.dataset.joker = "";
		}
	});

	//LOAD JOKER SLOTS AGAIN
	jokerSlots = document.querySelectorAll('.jokerSlot');
	//THEN REDRAW/REMOVE SLOTS BASED ON STORED DATA
	jokerSlots.forEach( (el) => {
		//IF NO JOKER IN THIS SLOT
		if(!el.dataset.joker){
			//console.log('NO JOKER IN SLOT WITH ID ' + el.id);
			//REMOVE THIS SLOT ENTIRELY!
			const emptySlot = document.getElementById(el.id);
			emptySlot.remove();
		}
	});
	
	//LOAD JOKER SLOTS AGAIN
	jokerSlots = document.querySelectorAll('.jokerSlot');
	//NOW, RENAME SLOTS 1 - x
	jokerSlots.forEach( (el, i) => {
		//console.log('SLOT ' + el.id + ' RENAMED TO ' + 'jokerSlot' + (i + 1));
		el.id = 'jokerSlot' + (i + 1);
		el.innerHTML = 'slot' + (i + 1);
	});

	for(let slot = 0; slot < jokerSlots.length; slot++){
		//console.log('SLOT',slot,jokerSlots[slot].dataset.joker);
	}
	//console.log('SLOTS', Array.from(jokerSlots).map( (slot) => { return slot.id}).join(','));
	document.getElementById('slotsInfo').innerHTML = Array.from(jokerSlots).map( (slot) => { return slot.id}).join(',');
}

function updateJokerOrder(){
	//CLEAR THE ORDER TO START
	jokerOrder = [];
	let jokerSlots = document.querySelectorAll('.jokerSlot');
	jokerSlots.forEach( (el) => {
		if(el.dataset.joker){
			jokerOrder.push(el.dataset.joker);
		}
	});
	//console.log('new order', jokerOrder);
	for(let joker = 0; joker < jokerOrder.length; joker++){
		//console.log('ORDER',joker,jokerOrder[joker]);
	}
	//console.log('ORDER', jokerOrder.join(','));
	document.getElementById('jokerOrder').innerHTML = jokerOrder.join(',');
}

/*<div class="w3-row-padding jokerRow">
	<div class="w3-col jokerSlot" id="jokerSlot1" data-joker="">
		<p>slot1</p>
	</div>*/
function addJokerSlot(){
	
	let jRow = document.getElementById('jokerRow');
	let previousSlotCount = jRow.children.length;
	let newSlot = document.createElement('div');
	newSlot.className = 'w3-col jokerSlot';
	newSlot.id = 'jokerSlot' + (previousSlotCount + 1);
	//newSlot.innerHTML = newSlot.id;
	jRow.appendChild(newSlot);
	return newSlot.id;
}

function removeJokerSlot()
{
	let jRow = document.getElementById('jokerRow');
	let previousSlotCount = jRow.children.length;
	//ONLY REMOVE DOWN TO 1 SLOT MINIMUM
	if(previousSlotCount > 1){
		jRow.children[previousSlotCount - 1].remove();
	}
}