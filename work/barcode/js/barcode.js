var barcodeDetector;

function initBarcodeDetector()
{
	// check compatibility
	if (!("BarcodeDetector" in globalThis)) 
	{
		//console.log("Barcode Detector is not supported by this browser.");
		writeToDebugLog("Barcode Detector is not supported by this browser.");
	} 
	else 
	{
		//console.log("Barcode Detector supported!");
		writeToDebugLog("Barcode Detection supported");
		// create new detector with formats specified (preferred for performance)
		/*
		const barcodeDetector = new BarcodeDetector({
			formats: ["code_39", "codabar", "ean_13"],
		});
		*/
		
		// create new detector with ALL formats
		barcodeDetector = new BarcodeDetector();

		// check supported types
		barcodeDetector.getSupportedFormats().then((supportedFormats) => {
			supportedFormats.forEach(
				(format) => 
					//console.log(format)
					writeToDebugLog(format)
			);
		});
	}
}

const scanBarcode = () => {
	if (barcodeDetector != undefined)
	{
		//Get video input
		const videoEl = document.getElementById("videoOutput");
		//Detect using the barcode detector
		barcodeDetector.detect(videoEl).then(function(result){
			//console.log(result);
			writeToDebugLog(result);
		}).finally(function(){
			//console.log("Completed scan!");
			writeToDebugLog("Completed scan!");
		});
	}
	else
	{
		//console.log("No barcode scanner setup - could not detect!");
		writeToDebugLog("No barcode scanner setup - could not detect!");
	}
}