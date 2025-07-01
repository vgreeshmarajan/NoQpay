// Web-specific configuration
if (typeof window !== 'undefined') {
  // Polyfill Worker if it doesn't exist
  if (typeof Worker === 'undefined') {
    window.Worker = class {
      constructor() {}
      postMessage() {}
      terminate() {}
      addEventListener() {}
      removeEventListener() {}
    };
  }

  // Polyfill for navigator.mediaDevices if it doesn't exist
  if (typeof navigator.mediaDevices === 'undefined') {
    navigator.mediaDevices = {
      getUserMedia: () => Promise.reject(new Error('Camera not supported'))
    };
  }
}
