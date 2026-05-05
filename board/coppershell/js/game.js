class Game 
{
	__constructor()
	{

	}

	getDieFace(faceNumber)
	{
		switch(Number(faceNumber))
		{
			case 1:
				return "&#9856;";
			case 2:
				return "&#9857;";
			case 3:
				return "&#9858;";
			case 4:
				return "&#9859;";
			case 5:
				return "&#9860;";
			case 6:
			default:
				return "&#9861;";
		}
	}

	updateAllDieFaces()
	{
		let dieEls = document.getElementsByTagName('die');
		for(let i = 0; i < dieEls.length; i++)
		{
			let face = dieEls[i].getAttribute('face');
			dieEls[i].innerHTML = this.getDieFace(face);
		}
	}
}