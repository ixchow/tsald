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



module.exports = build;
