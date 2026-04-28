const showTab = (tabName) => 
{
	let tabDisplays = document.getElementsByClassName("tabDisplay");

	//Hide all tabs
	tabDisplays.forEach( (tab) => 
	{
		//If we are on the tab to display
		if(tab.className.indexOf(tabName) > 0)
		{
			//Block display
			tab.style.display = 'block';
		}else{
			//Hide display
			tab.style.display = 'none';
		}
	});
}