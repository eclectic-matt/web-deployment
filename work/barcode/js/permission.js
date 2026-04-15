function getCameraPermission() 
{
	//add constraints object
	var constraints = {
		audio:false,
		video:true
	};

	//call getUserMedia
	navigator.mediaDevices.getUserMedia(constraints)
	.then(function(mediaStream)
	{
		var video = document.querySelector('#videoOutput');
		video.srcObject = mediaStream;
		video.play();
		//Hide Permission Button once setup
		document.getElementById("btnGetCameraPermission").style.display = "none";
	})
	.catch(function(err)
	{
		//console.log("There's an error!" + err.message);
		writeToDebugLog("There's an error!" + err.message);
	});
}