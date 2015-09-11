var path = require('path');

var tsaldPath = path.join(__dirname, "../tsald");

function canonicalizePath(request, relative) {
	var canonical = path.resolve(relative, request);
	return {canonical:canonical, relative:path.dirname(canonical)};
}

function canonicalizeTsaldPath(request, relative) {
	var ns = request.substr(0, 6);
	if (ns !== "tsald:") throw "canonicalizeTsaldPath called without a tsald:-prefixed string";
	var res = canonicalizePath(request.substr(6), tsaldPath);
	res.canonical = ns + res.canonical;
	return res;
}

function canonicalizeString(request, relative) {
	return {canonical:request, relative:''};
}

module.exports = {
	path:canonicalizePath,
	tsaldPath:canonicalizeTsaldPath,
	string:canonicalizeString
};
