const fs = require('fs-extra');

const webPath = 'lib/';
const iOSPath = 'styles/';

// before this runs we should clean the directories we are generating files in
// to make sure they are ✨clean✨
console.log(`cleaning ${webPath}...`);
fs.removeSync(webPath);

module.exports = {
  source: ['tokens/**/global_transformed.json'],
  action: {
    iOSColorsets: require("./src/colorsets-action"),
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
    iosSwift: {
      transformGroup: 'ios-swift-separate',
      buildPath: iOSPath,
      files: [{
        destination: 'StyleDictionaryColor.swift',
        format: 'ios-swift/enum.swift',
        className: 'StyleDictionaryColor'
      }]
    },
    iosColorsets: {
      buildPath: iOSPath,
      transforms: ['attribute/cti', 'name/cti/pascal', 'attribute/color'],
      actions: ['iOSColorsets'],
    },
  },
};
