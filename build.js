const fs = require('fs-extra');
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');
const iosColorsets = require('./actions/colorsets.ios');

const BASE_BUILD_PATH = 'lib/';
const WEB_PATH = `${BASE_BUILD_PATH}web/`;
const IOS_PATH = `${BASE_BUILD_PATH}ios/`;
const ANDROID_PATH = `${BASE_BUILD_PATH}android/`;

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
      buildPath: ANDROID_PATH,
      files: [{
        destination: 'design_token_colors.xml',
        format: 'android/colors'
      }]
    },
    compose: {
      transformGroup: 'compose',
      buildPath: ANDROID_PATH,
      files: [{
        destination: 'DesignTokenColor.kt',
        format: 'compose/object',
        className: 'DesignTokenColor',
        packageName: 'de.nebenan.app.ui.core.commoncompose.theme',
        filter: {
          attributes: {
            category: 'color'
          }
        }
      }]
    },
  },
};
