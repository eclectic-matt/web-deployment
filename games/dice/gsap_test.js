const jokers = document.querySelectorAll('.joker');

let jokerOrder = [];

jokers.forEach((item, i) => {

	Draggable.create(item, {
		
		onPress:()=>{
			//HIGHLIGHT SELECTED JOKER
			gsap.to(item, {duration:0.1, scale:1.2, zIndex:100})
			gsap.to(jokers, {duration:0.1, opacity:(i,t)=>(t==item)?1:0.3})
			//REMOVE JOKER FROM CURRENT SLOT (AND REMOVE SLOT)
			pickupJoker(item);
		},

		onDrag:()=>{
			let jokerSlots = document.querySelectorAll('.jokerSlot');
			if(Draggable.hitTest(item, jokerSlots, "20%")){
				gsap.to(this.jokerSlots, {duration:0.1, scale: 1.2})
			}
		},

		onRelease:()=>{ // return the item on release
			let slotFilled = false;
			let jokerSlots = document.querySelectorAll('.jokerSlot');
			gsap.to(item, {duration:0.4, scale:1, ease:'elastic.out(.45)'})
			gsap.to(jokers, {duration:0.2, opacity:1, zIndex:0 })
			
			//find target
			jokerSlots.forEach((slot, i) => {
				
				if(Draggable.hitTest(item, slot, "20%")){
					slotFilled = true;
					const newY = -slot.getBoundingClientRect().height;
					const newX = slot.getBoundingClientRect().left + window.scrollX;
					slot.dataset.joker = item.id;
					setJokerInSlot(slot, item);
					const timeline = gsap.timeline({ defaults: { duration: 1 }})
					timeline
						.to(jokerSlots, {duration:0.1, opacity:(i,t)=>(t==slot)?1:0.3})
						.to(slot, {duration:0.1, scale:1.2, zIndex:100})
						.to(item, {x:newX, y:newY, position: 'absolute', zIndex: 10})
						.to(jokerSlots, {duration:0.1, opacity:1, scale:1})
				}
			})

			//FINISH onRelease() BY ADDING/REMOVING JOKER SLOTS IF NEEDED
			if(slotFilled){
				addJokerSlot();
			}else{
				//DROPPED OUTSIDE THE JOKER ROW - REMOVE A SLOT
				removeJokerSlot();
			}

			updateJokerOrder();
		}
	})
})

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

function removeElement(element) {
	if (typeof(element) === "string") {
		element = document.querySelector(element);
	}
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
	newSlot.innerHTML = newSlot.id;
	jRow.appendChild(newSlot);
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