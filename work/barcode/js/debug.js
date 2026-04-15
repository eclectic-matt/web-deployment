function writeToDebugLog(message)
{
	const debugEl = document.getElementById("textareaDebugLog");
	debugEl.append(message + "\n");
}