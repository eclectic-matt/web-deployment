/**
 * Sorts all child elements by an attribute of those child elements.
 * @param {string} parentId The element ID of the parent (all children will be sorted).
 * @param {string} key The attribute to sort on, attached to the child element as <el key="value"></el>.
 * @param {string} direction The direction (ASC/DESC) to sort (default: ASC).
 */
function sortElements(parentId, key, direction='ASC'){
	var sorted = [];
	var unsorted = [];

	//GET PARENT
	var parent = document.getElementById(parentId);
	//GET CHILDREN
	var children = parent.children;

	//ITERATE CHILDREN
	Array.from(children).forEach((el) => {
		//if(el.tagName === 'DIV'){
			let thisObj = {};
			//thisObj.id = el.getAttribute('name');
			thisObj.id = el.id;
			thisObj.value = Number(el.getAttribute(key));
			unsorted.push(thisObj);
		//}
	}, key);

	//console.log(JSON.stringify(unsorted));
	if(direction==='ASC'){
		sorted = unsorted.sort(numberAscending);	
	}else{
		sorted = unsorted.sort(numberDescending);
	}
	//console.log(JSON.stringify(sorted));

	sorted.forEach((obj) => {
		let el = document.getElementById(obj.id);
		parent.append(el);
	}, parent);
}

//If the result is negative, a is sorted before b.
//If the result is positive, b is sorted before a.
//If the result is 0, no changes are done with the sort order of the two values.
function stringCompare(a, b) {
    return a[1].localeCompare(b[1]);
}
function numberAscending(a, b) {
	if(a.value===b.value) return 0;
	return (a.value < b.value ? -1 : 1);
}
function numberDescending(a, b) {
	if(a.value===b.value) return 0;
	return (b.value < a.value ? -1 : 1);
}