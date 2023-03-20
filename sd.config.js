const fs = require('fs-extra');

const webPath = 'lib/';
const iosPath = 'styles/';

// before this runs we should clean the directories we are generating files in
// to make sure they are ✨clean✨
console.log(`cleaning ${webPath}...`);
fs.removeSync(webPath);

module.exports = {
  source: ['tokens/**/global_transformed.json'],
  action: {
    iosColorsets: require("./src/colorsets-action"),
  },
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: webPath,
      files: [{
        destination: '_index.css',
        format: 'css/variables',
      }],
    },
    js: {
      transformGroup: 'js',
      buildPath: webPath,
      files: [{
        destination: 'index.js',
        format: 'javascript/es6',
      }],
    },
    iosColorsets: {
      buildPath: iosPath,
      transforms: ['attribute/cti', 'name/cti/snake', 'attribute/color'],
      actions: ['iosColorsets'],
    },
  },
};
