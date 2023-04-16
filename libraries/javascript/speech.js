
function say(thisText){
	//console.log('Saying ',thisText);
	thisText = String(thisText);
	if (speechOn){
		var synth = window.speechSynthesis;
		var voices = synth.getVoices();
		if ( (Number(thisText) <= 2500) && (Number(thisText) >= 1000) ){
			var cent_text = thisText.substring(0,2);
			var year_text = thisText.substring(2,4);
			thisText = cent_text + ' ' + year_text;
			console.log('Split year into ' + cent_text + ' ' + year_text);
		}
		var utterThis = new SpeechSynthesisUtterance(thisText);
		utterThis.voice = voices[0];
		utterThis.pitch = 1;
		utterThis.rate = 1;
		synth.speak(utterThis);
	}
}