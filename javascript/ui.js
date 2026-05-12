class Ui 
{
	typeText(text, el, delay=500)
	{
		el.innerHTML = null;
		for(let i = 1; i <= text.length; i++)
		{
			let currentText = text.substring(0, i );
			console.log(i, currentText);
			setTimeout( () => {
			console.log(currentText);
			el.innerHTML = currentText;
			}, i * delay, currentText);
		}
	}
}


/** 
 * Example usage
 * ================
	let ui = new Ui();
	let mainEl = document.getElementById("main");
	ui.typeText("Typed out message", mainEl);
*/