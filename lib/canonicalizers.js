var path = require('path');

var tsaldPath = path.join(__dirname, "../tsald");

function canonicalizePath(request, relative) {
	var canonical = path.resolve(relative, request);
	return [canonical, path.dirname(canonical)];
}

function canonicalizeTsaldPath(request, relative) {
	return canonicalizePath(request, tsaldPath);
}

function canonicalizeString(request, relative) {
	return [request, ''];
}

module.exports = {
	path:canonicalizePath,
	tsaldPath:canonicalizeTsaldPath,
	string:canonicalizeString
};
