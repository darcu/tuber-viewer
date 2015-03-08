function removeClass(element, className) {
	var classes = className.split(' ');

	classes.forEach(function(c) {
		if (element.classList) {
			element.classList.remove(c);
		} else {
			var currentClasses = element.className.split(' ');
			if (currentClasses.indexOf(c) !== -1) {
				currentClasses.splice(currentClasses.indexOf(c), 1);
			}
			var newClassName = '';
			for (var i = 0, n = currentClasses.length; i < n; i++) {
				newClassName += ' ' + currentClasses[i];
			}
			element.className = newClassName.trim();
		}
	});
}

function addClass(element, className) {
	var classes = className.split(' ');

	classes.forEach(function(c) {
		if (element.classList) {
			element.classList.add(c);
		} else {
			var currentClasses = element.className;
			if (currentClasses.indexOf(c) === -1) {
				var newClassName = '';
				newClassName = currentClasses + ' ' + c;
				element.className = newClassName;
			}
		}
	});
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

function formatNumber(num) {
	num = '' + num;
	var formattedNum = num;
	for (var i = num.length - 3; i > 0; i -= 3) {
		formattedNum = stringInsert(formattedNum, i, ',');
	}

	return formattedNum;
}

function stringInsert(s, index, string) {
	if (index > 0) {
		return s.substring(0, index) + string + s.substring(index, s.length);
	} else {
		return string + s;
	}
};

// external interfaces
module.exports.addClass = addClass;
module.exports.removeClass = removeClass;
module.exports.addOrRemoveClass = addOrRemoveClass;
module.exports.hasValue = hasValue;
module.exports.err = err;
module.exports.formatNumber = formatNumber;
