const { transformDimension } = require("@tokens-studio/sd-transforms");

const addMissingUnits = {
    name: 'custom/ts/size/px',
    type: 'value',
    transitive: true,
    matcher: /** @param {DesignToken} token */ token =>
        ['sizing', 'spacing', 'borderRadius', 'borderWidth', 'fontSizes', 'dimension', 'lineHeights', 'letterSpacing'].includes(
            token.type,
        ),
    transformer: /** @param {DesignToken} token */ token => transformDimension(token.value),
};

// Register an "attribute" transform to codify the font's details as named attributes.
const addNamedAttribute = {
    name: 'attribute/font',
    type: 'attribute',
    transformer: (prop) => ({
        category: prop.path[0],
        type: prop.path[1],
        family: prop.path[2],
        weight: prop.path[3],
        style: prop.path[4],
    }),
};

module.exports = {
    addMissingUnits,
    addNamedAttribute
}
