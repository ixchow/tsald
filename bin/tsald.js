#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"
/* the above is a work-around for node being called 'nodejs' on debian */

var cmd = process.argv.length > 2 ? process.argv[2] : '';

var usage = [
	'sald [command] arg1,...',
	'\tcommands',
	'\t\tbuild - build tsald project in working directory'
].join('\n');

switch(cmd) {
	case "build":
		var builder = require('../lib/builder.js');
		builder();
		break;
	default:
		console.log(usage);
		break;
}
