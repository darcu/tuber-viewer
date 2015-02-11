var list = (function() {
	var l = {};

	var vids = [];

	var currID = vids[0];
	var prevID = null;

	l.getListLength = function() {
		return vids.length;
	};

	l.getAllVideoIDs = function() {
		return vids;
	};

	l.getVideoIDatIndex = function(i) {
		return vids[i];
	};

	l.getCurrentVideoID = function() {
		return vids[0];
	};

	l.getPrevVideoID = function() {
		return prevID;
	};

	l.getBackwardVideoID = function() {
		var ci = vids.indexOf(currID);
		var bID = null;

		if (ci !== -1) {
			if (ci - 1 >= 0) {
				bID = vids[ci - 1];
			} else if (vids.length !== 0) {
				bID = vids[vids.length - 1];
			}
		}

		return bID;
	};

	l.getForwardVideoID = function() {
		var ci = vids.indexOf(currID);
		var fID = null;

		if (ci !== -1) {
			if (ci + 1 < vids.length) {
				fID = vids[ci + 1];
			} else if (vids.length !== 0) {
				fID = vids[0];
			}
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
