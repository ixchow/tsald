var fs = require('fs');

function cat(filename) {
	return fs.readFileSync(filename, 'utf8');
}

module.exports = {
	cat:cat,
};
