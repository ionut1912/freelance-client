const JSDOMEnvironment = require("jest-environment-jsdom").default;

// jsdom has no fetch or stream classes, which react-router and MSW need.
class Environment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);
    Object.assign(this.global, {
      AbortController,
      AbortSignal,
      Headers,
      Request,
      Response,
      fetch,
      FormData,
      ReadableStream,
      TransformStream,
      WritableStream,
      BroadcastChannel,
    });
  }
}

module.exports = Environment;
