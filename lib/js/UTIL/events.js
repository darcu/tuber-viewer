var events = {};

function trigger(type, data) {
	if (events[type]) {
		events[type].forEach(function(handler) {
			handler(data);
		});
	}
}
module.exports.trigger = trigger;

function addListener(type, handler) {
	if (!events[type]) {
		events[type] = [];
	}

	events[type].push(handler);
}
module.exports.addListener = addListener;
