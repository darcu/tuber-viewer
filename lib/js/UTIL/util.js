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

function formatNumber(num) {
	num = '' + num;
	var formattedNum = num;
	for (var i = num.length - 3; i >= 0; i -= 3) {
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

function netRequest(url, params, options, callback) {
	var api = '//localhost:5454/';
	url = api + url;

	var xhr = new XMLHttpRequest();

	xhr.open(options.method || 'POST', url, true);
	// xhr.withCredentials = true;
	xhr.send(JSON.stringify(params));

	xhr.addEventListener('load', function(e) {
		callback(null, JSON.parse(e.target.response));
	}, false);

	xhr.addEventListener('error', function(err) {
		callback(err);
	}, false);

	xhr.addEventListener('timeout', function(err) {
		callback(err);
	}, false);

	xhr.addEventListener('abort', function(err) {
		callback(err);
	}, false);
};

// external interfaces
module.exports.addClass = addClass;
module.exports.removeClass = removeClass;
module.exports.addOrRemoveClass = addOrRemoveClass;
module.exports.hasValue = hasValue;
module.exports.err = err;
module.exports.formatNumber = formatNumber;
module.exports.netRequest = netRequest;
