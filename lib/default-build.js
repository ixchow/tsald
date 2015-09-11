var c = require('./canonicalizers.js');
var t = require('./transforms.js');

module.exports = {
	require: 'main.js',
	skeleton: 'main.html',
	output: 'out.html',
	transforms: {
		'.js': {
			canonicalize:c.path,
			transform:t.cat
		},
		'tsald:': {
			canonicalize:c.tsaldPath,
			transform:function(canon) {
				if (canon.substr(0,6) !== 'tsald:') {
					throw "Trying to transform '" + canon + "', which doesn't start with tsald:";
				}
				return t.cat(canon.substr(6));
			}
		},
	}
};
