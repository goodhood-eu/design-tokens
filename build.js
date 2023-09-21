const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');
const iosColorsets = require('./actions/colorsets.ios');
const { removePrefixForCompose, removePrefixForAndroid } = require('./transforms/android_transforms');

const BASE_BUILD_DIR = 'lib';
const WEB_PATH = `${BASE_BUILD_DIR}/web/`;
const IOS_PATH = `${BASE_BUILD_DIR}/ios/`;
const ANDROID_PATH = `${BASE_BUILD_DIR}/android/`;

registerTransforms(StyleDictionary);

// Following my question: https://github.com/tokens-studio/sd-transforms/issues/31#issuecomment-1471665174
// this was the solution for now to get cross-reference working.
// This code removes upper keys of the objects and brings the values 1 level up
// TODO: once we use multiple files / paid version we might get rid of this
StyleDictionary.registerParser({
  pattern: /\.json$/,
  parse: ({ filePath, contents }) => {
    const parsed = JSON.parse(contents);
    const newObj = {};

    // Loop over all tokensets
    Object.values(parsed).forEach((val) => {
      // Grab all entries and put them at the top of new object
      Object.entries(val).forEach(([key, innerVal]) => {
        newObj[key] = innerVal;
      })
    })

    return newObj;
  }
});


StyleDictionary.registerTransform(removePrefixForAndroid)
StyleDictionary.registerTransform(removePrefixForCompose)

module.exports = {
  source: ['tokens/**/global.json'],
  action: { iosColorsets },
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      buildPath: WEB_PATH,
      files: [{
        destination: 'index.css',
        format: 'css/variables',
      }],
    },
    js: {
      transformGroup: 'tokens-studio',
      buildPath: WEB_PATH,
      files: [{
        destination: 'index.js',
        format: 'javascript/es6',
      }],
    },
    ios: {
      buildPath: IOS_PATH,
      transforms: ['attribute/cti', 'name/cti/pascal', 'attribute/color'],
      actions: ['iosColorsets'],
    },
    android: {
      transformGroup: 'android',
      transforms: ['attribute/cti', 'name/cti/snake', 'color/hex8android', 'removePrefixForAndroid'],
      buildPath: ANDROID_PATH,
      files: [{
        destination: 'color_tokens.xml',
        format: 'android/colors'
      }]
    },
    compose: {
      transformGroup: 'compose',
      transforms: ['attribute/cti', 'name/cti/pascal', 'color/composeColor', 'removePrefixForCompose'],
      buildPath: ANDROID_PATH,
      files: [{
        destination: 'ColorToken.kt',
        format: 'compose/object',
        className: 'ColorToken',
        packageName: 'de.nebenan.app.design',
        filter: {
          attributes: {
            category: 'color'
          }
        },
      }]
    },
  },
};
