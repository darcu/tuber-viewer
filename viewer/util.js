function removeClass(element, className) {
	var currentClasses = element.className.split(' ');
	if (currentClasses.indexOf(className) !== -1) {
		currentClasses.splice(currentClasses.indexOf(className), 1);
	}
	var newClassName = '';
	for (var i = 0, n = currentClasses.length; i < n; i++) {
		newClassName += currentClasses[i] + ' ';
	}
	element.className = newClassName;
}

function addClass(element, className) {
	var currentClasses = element.className;
	if (currentClasses.indexOf(className) === -1) {
		var newClassName = '';
		newClassName = currentClasses + ' ' + className;
		element.className = newClassName;
	}
}
