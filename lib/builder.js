var fs = require('fs');
var path = require('path');

var build = require('./build.js');




function builder() {
	var indices = {};
	var expanded = [];

	var errors = 0;

	function error(message) {
		console.log("ERROR: " + message);
		++errors;
	}

	var skeleton;
	try {
		skeleton = fs.readFileSync(build.skeleton, 'utf8');
		if (skeleton.indexOf("<scripts />") === -1) {
			throw "Skeleton doesn't appear to contain a <scripts /> tag.";
		}
	} catch (e) {
		error(e);
		skeleton = "<scripts />";
	}

	function require_for(request, relative) {
		try {
			var transform;
			var index;
			if ((index = request.indexOf(':')) !== -1) {
				var ns = request.substr(0, index + 1);
				if (ns in build.transforms) {
					transform = build.transforms[ns];
				}
			} else if ((index = request.indexOf('.')) !== -1) {
				var ext = request.substr(index);
				if (ext in build.transforms) {
					transform = build.transforms[ext];
				}
			}
			if (typeof(transform) === 'undefined') {
				throw "No transform for require'd string '" + request + "'.";
			}
			var res = transform.canonicalize(request, relative);

			if (!(res.canonical in indices)) {
				indices[res.canonical] = expanded.length;
				var key = expanded.length.toString();
				expanded.push({
					canonical:res.canonical,
					relative:res.relative,
					key:key,
					transform:transform.transform,
				});
			}

			var exp = expanded[indices[res.canonical]];
			if (exp.relative !== res.relative) {
				console.warn("Relative-to mis-match between canonical entry and new entry.");
			}

			return "require(" + exp.key + ")";
		} catch (e) {
			error(e);
			return "undefined /* ERROR */";
		}

	}

	require_for(build.require, process.cwd());

	var output = "";

	output +=
		"function require(key) {\n" +
		"	return require.table[key]();\n" +
		"}\n" +
		"require.table = ["
		;

	//recursively expand:
	for (var i = 0; i < expanded.length; ++i) {
		try {
			var exp = expanded[i];
			console.log("Transforming '" + exp.canonical + "'.");
			var jstxt = exp.transform(exp.canonical);

			//parse code looking for "require()":

			var reqRegExp = /require\s*\((?:\s*"[^"]*"|'[^']*'\s*)\)\s*/gm;
			var reqs = jstxt.match(reqRegExp) || [];

			reqs.forEach(function(req) {
				var res = req.match(/"(.*)"|'(.*)'/);
				var request = res[1] || res[2];
				var replacement = require_for(request, exp.relative);
				jstxt = jstxt.replace(req, replacement);
			});

			if (i === 0) {
				output += "\n";
			} else {
				output += ",\n";
			}
			output +=
				"function() {\n" +
				"	var m = {exports:{}};\n" +
				"	require.table[" + exp.key + "] = function() { return m.exports; };\n" +
				"	(function(module){\n" +
				jstxt +
				"	})(m);\n" +
				"	return m.exports;\n" +
				"}"
				;
		} catch (e) {
			error(e);
		}
	}

	output +=
		"\n];\n" +
		"require(" + expanded[0].key + ");\n"
		;

	output = "<script>\n" + output + "</script>";


	skeleton = skeleton.replace("<scripts />", output);

	console.log("Writing '" + build.output + "'");
	fs.writeFileSync(build.output, skeleton);

}


module.exports = builder;
