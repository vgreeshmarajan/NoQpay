if (typeof window !== 'undefined') {
  // Polyfill Worker if it doesn't exist
  if (typeof Worker === 'undefined') {
    window.Worker = class extends EventTarget {
      constructor(scriptURL: string | URL, options?: WorkerOptions) {
        super();
      }
      postMessage(message: any, transfer?: Transferable[] | StructuredSerializeOptions) {}
      terminate() {}
      addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {}
      removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {}
      onmessage: EventListener | null = null;
      onerror: EventListener | null = null;
      onmessageerror: EventListener | null = null;
    };
  }

  // Polyfill for navigator.mediaDevices if it doesn't exist
  if (typeof navigator.mediaDevices === 'undefined') {
    // @ts-ignore
    navigator.mediaDevices = {
      getUserMedia: () => Promise.reject(new Error('Camera not supported'))
    };
  }
}
