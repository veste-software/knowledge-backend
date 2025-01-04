// jest.polyfills.js
const { TextDecoder, TextEncoder, ReadableStream } = require('node:util');
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
});
