class LayoutManager
{
	#screenNames = [
		"menu",
		"map",
		"inventory",
		"battle",
		"battleResult",
		"chest",
		"event",
		"merchant"
	];
	#currentScreen = null;
	
	constructor()
	{
		this.initLayout();
	}

	initLayout()
	{
		this.#currentScreen = this.#screenNames[0];
		this.loadScreen();
	}

	loadScreen()
	{
		switch(this.#currentScreen)
		{
			case "menu":

			break;
		}
	}
}