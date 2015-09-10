var c = require('./canonicalizers.js');
var t = require('./transforms.js');

module.exports = {
	js: 'main.js',
	html: 'main.html',
	output: 'out.html',
	transforms: {
		'.js': {
			canonicalize:c.path,
			transform:t.cat
		},
		'tsald:': {
			canonicalize:c.tsaldPath,
			transform:t.cat
		},
	}
};
