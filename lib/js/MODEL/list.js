var list = (function() {
	var l = {};

	var vids = [];

	var currID;
	var prevID;

	l.getListLength = function() {
		return vids.length;
	};

	l.getAllVideoIDs = function() {
		return vids.slice();
	};

	l.getVideoIDatIndex = function(i) {
		return vids[i];
	};

	l.getCurrentVideoID = function() {
		return currID || vids[0];
	};

	l.getCurrentVideoIndex = function() {
		var index = vids.indexOf(l.getCurrentVideoID());
		(index === -1) && (index = 0);
		return index;
	};

	l.getPrevVideoID = function() {
		return prevID || vids[vids.length - 1];
	};

	l.getBackwardVideoID = function() {
		var ci = l.getCurrentVideoIndex();
		var bID = ci;

		if (ci === 0 && vids.length) {
			bID = vids[vids.length - 1];
		} else {
			bID = vids[ci - 1];
		}

		return bID;
	};

	l.getForwardVideoID = function() {
		var ci = l.getCurrentVideoIndex();
		var fID = ci;

		if (ci === vids.length - 1) {
			fID = vids[0];
		} else {
			fID = vids[ci + 1];
		}

		return fID;
	};

	l.setCurrentID = function(ID) {
		prevID = currID;
		currID = ID;
	};

	l.removeID = function(id) {
		var index = vids.indexOf(id);
		if (index !== -1) {
			vids.splice(index, 1);
		}
	};

	l.addID = function(id) {
		vids.push(id);
	};

	return l;
}());

module.exports = list;
