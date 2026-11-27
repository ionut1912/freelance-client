// Babel plugin for Jest: `import.meta` (used by React Router) is a syntax error
// once modules are compiled to CommonJS, so replace it with an empty object.
module.exports = ({ types }) => ({
  visitor: {
    MetaProperty(path) {
      if (path.node.meta.name === "import") {
        path.replaceWith(types.objectExpression([]));
      }
    },
  },
});
