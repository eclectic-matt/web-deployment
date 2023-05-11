function initModal(){

	//MODAL (SETTINGS)
	const openButton = document.querySelector('[data-open-modal]');
	const closeButton = document.querySelector('[data-close-modal]');
	const modal = document.querySelector('[data-modal]');

	openButton.addEventListener('click', () => {
		modal.showModal();
	});

	closeButton.addEventListener('click', () => {
		modal.close();
	});

	const openHelpButton = document.querySelector('[data-open-help]');
	const closeHelpButton = document.querySelector('[data-close-help]');
	const helpModal = document.querySelector('[help-modal]');

	openHelpButton.addEventListener('click', () => {
		helpModal.showModal();
	});

	closeHelpButton.addEventListener('click', () => {
		helpModal.close();
	});

	var settingsEvent = document.createEvent("Event");
	settingsEvent.initEvent("click", false, true); 
	openHelpButton.dispatchEvent(settingsEvent);

}