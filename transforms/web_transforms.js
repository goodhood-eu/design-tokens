const {transformDimension} = require("@tokens-studio/sd-transforms");
const addMissingUnits = {
    name: 'custom/ts/size/px',
    type: 'value',
    transitive: true,
    matcher: /** @param {DesignToken} token */ token =>
        ['sizing', 'spacing', 'borderRadius', 'borderWidth', 'fontSizes', 'dimension', 'lineHeights'].includes(
            token.type,
        ),
    transformer: /** @param {DesignToken} token */ token => transformDimension(token.value),
};

module.exports = {
    addMissingUnits
}