var fs = require('fs');
var path = require('path');

var build = require('./build.js');

function builder() {

	console.log("I should be building something I guess.");

	//Build a table that maps from canonical names to blocks of code.

	//function require(key) {
	//  require.functions
	//  if (key in table) return table[key];
	//}

	/* emit something along these lines:
	var require_419 = function() {
		var module = { exports:{} };
		var result = module.exports;
		require_419 = function() { return result; } //it's here to implement node-style require() semantics / break infinite loops
		(function(module){
		// user code ...
		})(module);
		return require_419();
	}


	*/

	//TODO: start by requiring the entrypoint.
	// paste the resulting blob into the skeleton.

}


module.exports = builder;
