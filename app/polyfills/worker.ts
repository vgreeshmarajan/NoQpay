/* eslint-disable */
// Polyfill for Worker in web environment
if (typeof window !== 'undefined' && typeof Worker === 'undefined') {
  // @ts-ignore
  window.Worker = class {
    constructor() {}
    postMessage() {}
    terminate() {}
    addEventListener() {}
    removeEventListener() {}
  };
}
