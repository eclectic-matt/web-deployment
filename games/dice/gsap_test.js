// gsap.from('.header', { duration: 1, y: '-100%', ease: 'bounce' })
// gsap.from('.link', { duration: 1, opacity: 0, delay: 1, stagger: .5 })
// gsap.from('.right', { duration: 1, x: '-100vw', delay: 1, ease: 'power2.in' })
// gsap.from('.left', { duration: 1, delay: 1.5, x: '-100%' })
// gsap.to('.footer', { duration: 1, y: 0, ease: 'elastic', delay: 2.5 })
// gsap.fromTo('.button', { opacity: 0, scale: 0, rotation: 720 }, { duration: 1, delay: 3.5, opacity: 1, scale: 1, rotation: 0 })
/*
const timeline = gsap.timeline({ defaults: { duration: 1 }})
timeline
  .from('.header', { y: '-100%', ease: 'bounce' })
  .from('.link', { opacity: 0, stagger: .5 })
  .from('.right', { x: '-100vw', ease: 'power2.in' }, 1)
  .from('.left', { x: '-100%' }, '<.5')
  .to('.footer', {  y: 0, ease: 'elastic' })
  .fromTo('.button', { opacity: 0, scale: 0, rotation: 720 }, { opacity: 1, scale: 1, rotation: 0 })

const button = document.querySelector('.button')

button.addEventListener('click', () => {
  timeline.timeScale(3)
  timeline.reverse()
})
*/

const jokerSlots = document.querySelectorAll('.jokerSlot');

const jokers = document.querySelectorAll('.joker');

jokers.forEach((item, i) => {
	//console.log('init draggable', item);
	Draggable.create(item, {
		onPress:()=>{ // bring the item forward on press
	      gsap.to(item, {duration:0.1, scale:1.2, zIndex:100})
	      gsap.to(jokers, {duration:0.1, opacity:(i,t)=>(t==item)?1:0.3})
	    },
	    onDrag:()=>{
	    	if(Draggable.hitTest(item, jokerSlots, "20%")){
	    		gsap.to(jokerSlots, {duration:0.1, scale: 1.2})
	    	}
	    },
	    
	    onRelease:()=>{ // return the item on release
	      gsap.to(item, {duration:0.4, scale:1, ease:'elastic.out(.45)'})
	      gsap.to(jokers, {duration:0.2, opacity:1, zIndex:0 })
	      //find target
	      jokerSlots.forEach((slot, i) => {
	        //console.log('checking for hit', slot.id);
	        if(Draggable.hitTest(item, slot, "20%")){
	      	  
	      	  //const newY = slot.getBoundingClientRect().top + window.scrollY - slot.style.height;
	      	  const newY = -slot.getBoundingClientRect().height;
	      	  const newX = slot.getBoundingClientRect().left + window.scrollX;
	      	  console.log('Hit!', item.id, slot.id, newX, newY);
	      	  
	      	  const timeline = gsap.timeline({ defaults: { duration: 1 }})
			  timeline
				.to(jokerSlots, {duration:0.1, opacity:(i,t)=>(t==slot)?1:0.3})
	      		.to(slot, {duration:0.1, scale:1.2, zIndex:100})
	      		.to(item, {x:newX, y:newY, position: 'absolute', zIndex: 10})
	      		.to(jokerSlots, {duration:0.1, opacity:1, scale:1})
	        }
	      })
		}
	})
})

function addJokerSlot(){
	/*<div class="w3-row-padding jokerRow">
  	<div class="w3-col jokerSlot" id="jokerSlot1">
  		<p>slot1</p>
  	</div>  	
  	*/
  	let jRow = document.getElementById('jokerRow');
  	let previousSlotCount = jRow.children.length;
  	let newSlot = document.createElement('div');
  	newSlot.className = 'w3-col jokerSlot';
  	newSlot.id = 'jokerSlot' + (previousSlotCount + 1);
  	newSlot.innerHTML = newSlot.id;
  	jRow.appendChild(newSlot);
}



/*
  Draggable.create(item, {
    onPress:()=>{ // bring the item forward on press
      gsap.to(item, {duration:0.1, scale:1.2, rotate:'random(-9,9)', zIndex:100})
      gsap.to(items, {duration:0.1, opacity:(i,t)=>(t==item)?1:0.3})
    },
      
	onRelease:()=>{ // return the item on release
      gsap.to(item, {duration:0.4, x:0, y:0, rotate:0, scale:1, ease:'elastic.out(.45)'})
      gsap.to(items, {duration:0.2, opacity:1, zIndex:0 })
    },
    
    onDrag:()=>{
      if ( !gsap.isTweening(logo) ){ // prevent overlapping color changes
        if ( Draggable.hitTest(item, logo, 12) ){ // check if item is over the logo
          gsap.to('.logo #gradient stop', { // if so, change stop element's stop-color attribute
            attr:{ 'stop-color' : (n) => itemColor[n] }
          })
        }
      }
    }
  })
  
})


// // 💚 This just adds the GSAP link to this pen, don't copy this bit
// i






Draggable.create(".joker", {
	type: "x",
	liveSnap: {
	  //snaps to the closest point in the array, but only when it's within 15px (new in GSAP 1.20.0 release):
		points: [
			{ x: 0, y: 0 },
			{ x: 150, y: 0 },
			{ x: 300, y: 0 },
			{ x: 450, y: 0 },
			{ x: 600, y: 0 }
		],
		radius: 74
	},
	bounds: document.getElementById("jokerRow"),
		inertia: true,
		onClick: function() {
			//console.log("clicked");
		},
		onDragEnd: function(ev) {
			//console.log("drag ended", ev.currentTarget.id, );;
			//this works - this.target.id
			//Check collision with other jokers and reorder joker row
			/*let jokerEls = document.getElementById('jokerRow').children;
			jokerEls = [...jokerEls];
			console.log(jokerEls);
			let jokerOrder = [];
			for(let idx of jokerEls){
				let jokerEl = jokerEls[idx]; 
				console.log(jokerEl.id, jokerEl.style.left);
				let storeOrder = {
					left: jokerEl.style.left,
					id: jokerEl.id
				}
				let insertFlag = false;
				for(let i=0; i < jokerOrder.length; i++){
					if(jokerOrder[i].left > storeOrder.left){
						jokerOrder.splice(i,0,storeOrder);
						insertFlag = true;
					}
				}
				if(!insertFlag){
					jokerOrder.push(storeOrder);
				}
			}
						
			console.log('New order', jokerOrder);
		},*/
//	}
//});