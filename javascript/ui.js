class Ui 
{
	typeText(text, el, delay=500)
	{
		el.innerHTML = null;
		for(let i = 1; i < text.length; i++)
		{
			let currentText = text.substring(i);
			setTimeout( (i) => {
				el.innerHTML = text.substring(i);
			}, i * delay);
		}
	}
}