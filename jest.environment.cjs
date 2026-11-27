const JSDOMEnvironment = require("jest-environment-jsdom").default;

// jsdom has no fetch classes, which react-router needs for redirects and loaders.
class Environment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);
    Object.assign(this.global, {
      AbortController,
      AbortSignal,
      Headers,
      Request,
      Response,
    });
  }
}

module.exports = Environment;
