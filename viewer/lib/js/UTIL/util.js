function removeClass(element, className) {
	var currentClasses = element.className.split(' ');
	if (currentClasses.indexOf(className) !== -1) {
		currentClasses.splice(currentClasses.indexOf(className), 1);
	}
	var newClassName = '';
	for (var i = 0, n = currentClasses.length; i < n; i++) {
		newClassName += ' ' + currentClasses[i];
	}
	element.className = newClassName.trim();
}


function addClass(element, className) {
	var currentClasses = element.className;
	if (currentClasses.indexOf(className) === -1) {
		var newClassName = '';
		newClassName = currentClasses + ' ' + className;
		element.className = newClassName;
	}
}

function addOrRemoveClass(element, className, condition) {
	if (condition) {
		addClass(element, className);
	} else {
		removeClass(element, className);
	}
}

// fuck truthy
function hasValue(x) {
	return x !== null && x !== undefined;
}

function err(err) {
	console.error(err);
}

// external interfaces
module.exports.err = err;
module.exports.addClass = addClass;
module.exports.removeClass = removeClass;
module.exports.addOrRemoveClass = addOrRemoveClass;
module.exports.hasValue = hasValue;
