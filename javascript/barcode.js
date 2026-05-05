class BarcodeDetection 
{
	setup = false;
	detector = undefined;
	formats = [];

	//Constructor
	__constructor()
	{
		// check compatibility
		if (!("BarcodeDetector" in globalThis)) 
		{
			console.log("Barcode detector is not supported by this browser");
		}
		this.detector = new BarcodeDetector();
		this.setup = true;
		this.formats = this.detector.getSupportedFormats();
	}

	//Scan a barcode, passing in the video/img element which contains the barcode
	scanBarcode = (videoElementId) => 
	{
		if(!this.setup || this.detector === undefined)
		{
			console.log("Barcode detector is not setup!");
			return;
		}
		//Get video input
		const videoEl = document.getElementById(videoElementId);
		//Detect using the barcode detector
		this.detector.detect(videoEl)
		.then(
			function(barcodes)
			{
				barcodes.forEach(
					(barcode) => 
						console.log("BARCODE", barcode.rawValue, barcode.format)
				);
			}
		).finally(
			function()
			{
				//Completed scan
			}
		)
		.catch(
			function(err)
			{
				//Caught error
				console.log("BARCODE SCAN ERROR", err);
			}
		);
	}
}