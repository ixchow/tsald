/*
 * This reads any project-local build.js and uses it to override the default
 * build settings, returning the complete object.
 *
 */

var fs = require('fs');
var path = require('path');

var build = require('./default-build.js');
var userBuild;

try {
	userBuild = require(path.join(process.cwd(),'build.js'));
} catch (err) {
	switch(err.code) {
		case 'MODULE_NOT_FOUND':
			console.error('build.js not found, please ensure build.js is in the current directory.');
			break;
		default:
			console.error(err);
			break;
	}
	process.exit();
}

['require', 'skeleton', 'output'].forEach(function(key) {
	if (key in userBuild) {
		build[key] = userBuild[key];
		delete userBuild[key];
		console.log(key + ": " + build[key]);
	} else {
		console.log(key + ": " + build[key] + " (from default config)");
	}
});

if ('transforms' in userBuild) {
	for (key in userBuild.transforms) {
		build.transforms[key] = userBuild.transforms[key];
	}
	delete userBuild.transforms;
}

for (key in userBuild) {
	console.warn("Ignoring property '" + key + "' exported by build.js");
}

var c = require('./canonicalizers.js');

for (key in build.transforms) {
	var transform = build.transforms[key];
	if (typeof(transform) === 'function') {
		transform = build.transforms[key] = { transform:transform };
	}
	if (typeof(transform) !== 'object' || !('transform' in transform)) {
		console.error("ERROR: Transform for key '" + key + "' isn't a function or object containing a 'transform' key.");
		process.exit(1);
	}
	if (key.substr(-1) === ':') {
		if (key.substr(0,1) === '.') {
			console.info("Transform with key '" + key + "' will be treated like a prefix, not a suffix.");
		}
		if (!('canonicalize' in transform)) {
			transform.canonicalize = c.string;
			console.info("Adding string-like canonicalizer to transform for '" + key + "'.");
		}
	} else if (key.substr(0,1) === '.') {
		if (!('canonicalize' in transform)) {
			transform.canonicalize = c.path;
			console.info("Adding path-like canonicalizer to transform for '" + key + "'.");
		}
	} else {
		console.error("transform key '" + key + "' doesn't end with ':' or start with '.', and thus isn't valid.");
	}
}



module.exports = build;
