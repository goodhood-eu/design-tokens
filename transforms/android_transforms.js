const removePrefixForCompose = {
  type: 'name',
  name: 'removePrefixForCompose',
  transformer: (token) => {
    return token.name.replace(/^(ColorPrimitive|ColorSemantic)/, '');
  }
};

const removePrefixForAndroid = {
  type: 'name',
  name: 'removePrefixForAndroid',
  transformer: (token) => {
    return token.name.replace(/^(color_primitive_|color_semantic_)/, '');
  }
};

module.exports = {
  removePrefixForCompose,
  removePrefixForAndroid,
};
