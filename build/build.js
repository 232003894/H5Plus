var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var babel = require('rollup-plugin-babel');
var package = require('../package.json');
var banner =
  "/*!\n" +
  " * h5p.js v" + package.version + "\n" +
  " * https://github.com/232003894/H5Plus\n" +
  " * Released under the MIT License.\n" +
  " */\n";

rollup.rollup({
    entry: 'src/index.js',
    plugins: [
      babel({
        presets: ['es2015-loose-rollup']
      })
    ]
  })
  .then(function (bundle) {
    return write('index.js', bundle.generate({
      format: 'cjs',
      banner: banner
    }).code, bundle);
  })
  .catch(logError);

function write(dest, code, bundle) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
