#Tsald
The [tchow](http://tchow.com) fork of [sald](https://github.com/ixchow/sald).
Basically, I wanted to clean up some of the internals and default transformations, but felt that removing functionality from the original sald wasn't particularly nice.

##Idea
Tsald is designed to pack a bunch of assets -- javascript, images, sounds, shaders, and so on -- into a single, easy-to-distribute, .html file.
To do this, it builds on node's `require()` mechanism.

In tsald projects, you can still write `file = require("file.js")` to get access to whatever `file.js` exports; however,
you can also do say `image = require("something.jpeg")` to load an image,
or even -- if you define the right functions -- write things like `model = require("tank.blend")` to load 3D models.

This is made possible through the magic of transforms -- functions that (given a string), return javascript code representing that string's data.
For instance, when tsald sees `require("something.js")` it calls the ".js" transform which simply reads the file from disk and returns its contents.

The partner of the tsald transform is the canonicalizer.
Canonicalizers are functions that -- given a string and a caller -- provide a canonical representation (a string) for a `require`'d resource. (The caller is sometimes important for relative path resolution.)

##Installation
Clone this repo into desired location then from command line run
```
npm link
```
Note: sudo may be required on Mac or Linux, or the command prompt may need to be
run as administrator on Windows.

Note: The current version of node.js for windows has a bug. If you receive an
ENOENT error, check [here](http://stackoverflow.com/questions/25093276/node-js-windows-error-enoent-stat-c-users-rt-appdata-roaming-npm)

##Usage
```
tsald build
    builds tsald project in cwd based on build.js
```

##build.js
The build.js file must be in the current working directory when calling `tsald`.
This file should export an object which specifies the output location, entry point, and methods for handling custom file types.
By default, Tsald handles transformations for common types, like `.js`, `.json`, `.png`, `.jpg`, `.wav`, `.ogg`. You may override these with your own handlers if you wish. All other filetypes will need a handler implemented in this `build.js`.

Sald can also handle `colon`ical transforms, specified like `gradient:#000-#fff`, for which you must specify a function which generates a JS block that exports the expected return value.

Each transform can also take the object form `{canonicalFunc: aFunc, tranformFunc: bFunc}`, where `bFunc` is what you used before, and `aFunc` is used to determine the canonical name of the parameter. This is used to ensure there is no duplication of resolved `require`s in the final output html file. If the transform is not in this object form, then a default canonical function is assumed (direct string comparison for `colon`icals, and normalized path comparison for file extension types).

###Example build.js
```
function gradientCanon(param) {
  // some conversion here
  // ex: 'black-white' will be converted to '#000-#fff'
  return convertedString;
}

function gradientTransform(param) {
  // some external imagemagick call
  return 'var img = new Image(); img.src = ' + base64Data + '; module.exports = img;';
}

function unownCanon(filepath, rootpath) {
  // rootpath is the name of the folder where the require is called. Useful for relative require parsing, using _path.join_
  canonicalName = someTransformation();
  return canonicalName;
}

function unownLoader(filepath) {
  // filepath passed is the resule of unownCanon
  var someJsTxt = something //your loader
  return 'module.exports = ' + someJsTxt;
}

// Export build options
module.exports = {
  // Input options:
  js : 'src/main.js',       //execution will effectively start with 'require("src/main.js")'
  html : 'src/main.html',   //<scripts/> tag will be replaced with final output
  // Output options:
  output : 'build.html', //final build project
  // Custom transforms:
  transforms : {
    'gradient:': {
      canonicalFunc: gradientCanon,
      transformFunc: gradientTransform
    },
    '.unown': { // If a custom canonicalization is needed
      canonicalFunc: unownCanon,
      transformFunc: unownLoader
    },
    '.unown': unownLoader // If no custom canonicalization is needed for this type
};
```

This build.js file now knows what to do with a `require('../pokedex/pokemon87.unown');` or `require('gradient:black-white')`.


##Libraries

- [mainloop.js](sald/mainloop.js) [docs](docs/mainloop.md) provides a basic mainloop.
