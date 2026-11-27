// The @mui/icons-material barrel loads thousands of files per test file, so
// named icons are replaced by stubs carrying the same data-testid as MUI's.
const { createElement, forwardRef } = require("react");

const icons = {};

module.exports = new Proxy(
  { __esModule: true },
  {
    get(target, name) {
      if (name in target || typeof name !== "string") {
        return target[name];
      }
      // Transitions such as Zoom need the ref and style to reach the element.
      icons[name] ??= forwardRef(({ style }, ref) =>
        createElement("svg", { ref, style, "data-testid": `${name}Icon` }),
      );
      return icons[name];
    },
  },
);
