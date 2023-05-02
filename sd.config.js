const fs = require('fs-extra');
const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');

registerTransforms(StyleDictionary);

const webPath = 'lib/';
const iosPath = 'styles/';

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
  action: {
    iosColorsets: require("./src/iOS/colorsets-action"),
  },
  platforms: {
    css: {
      transformGroup: 'tokens-studio',
      buildPath: webPath,
      files: [{
        destination: '_index.css',
        format: 'css/variables',
      }],
    },
    js: {
      transformGroup: 'tokens-studio',
      buildPath: webPath,
      files: [{
        destination: 'index.js',
        format: 'javascript/es6',
      }],
    },
    iosColorsets: {
      buildPath: iosPath,
      transforms: ['attribute/cti', 'name/cti/pascal', 'attribute/color'],
      actions: ['iosColorsets'],
    },
    android: {
          transformGroup: 'android',
          buildPath: '../app/src/main/res/values/',
          files: [{
            destination: 'design_token_colors.xml',
            format: 'android/colors'
          }]
        },
    compose: {
      transformGroup: 'compose',
      buildPath: '../app/src/main/java/de/nebenan/app/ui/core/commoncompose/theme/',
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
