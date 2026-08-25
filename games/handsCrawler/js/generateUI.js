const handsEl = document.getElementById('hands');
/*
<div id="leftHand">
	<div class="drop-zone" id="left-pinky" title="Left Pinky"></div>
	<div class="drop-zone" id="left-ring"></div>
	<div class="drop-zone" id="left-middle"></div>
	<div class="drop-zone" id="left-index"></div>
	<div class="drop-zone" id="left-thumb"></div>
</div>
<div id="rightHand">
	<div class="drop-zone" id="right-thumb"></div>
	<div class="drop-zone" id="right-index"></div>
	<div class="drop-zone" id="right-middle"></div>
	<div class="drop-zone" id="right-ring"></div>
	<div class="drop-zone" id="right-pinky"></div>
</div>
*/

const initUI = () => {
	generateHands();
}

const generateHands = () => {
	let handNames = ["left", "right"];
	let fingerNames = ["pinky", "ring", "middle", "index", "thumb"];
	for(hand = 1; hand <= 2; hand++)
	{
		let hand = document.createElement("div");
		let handName = handNames.shift();
		hand.id = handName + "Hand";
		for(digit = 1; digit <= 5; digit++)
		{
			let finger = document.createElement("div");
			finger.id = handName + "-" + fingerNames[digit - 1];
			finger.title = handName + " " + fingerNames[digit - 1];
			finger.classList.add("drop-zone");
			hand.appendChild(finger);
		}
		handsEl.appendChild(hand);
		fingerNames.reverse();
	}
	//Now add event listeners to the generated elements
	setupDraggables();
}