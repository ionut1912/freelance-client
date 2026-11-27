// jsdom does not provide these, and react-router needs them.
const { TextEncoder, TextDecoder } = require("node:util");

Object.assign(globalThis, { TextEncoder, TextDecoder });

// Same shape as .env: the base url includes /api.
process.env.REACT_APP_API_BASE = "https://localhost:7020/api";
