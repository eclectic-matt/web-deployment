const openPanel = (panelName) => {
	var i;
	var x = document.getElementsByClassName("panel");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	document.getElementById(panelName).style.display = "block";
}