import { vi } from 'vitest';

// Mock Browser Support
if (typeof window === 'undefined') {
  global.window = {
    URL: {
      createObjectURL: vi.fn(),
      revokeObjectURL: vi.fn()
    }
  } as any;
}

// Mock Web Worker
class Worker {
  constructor(stringUrl: string) {
    this.url = stringUrl;
    this.onmessage = () => {};
  }

  url: string;
  onmessage: (event: any) => void;

  postMessage(msg: any) {
    this.onmessage({ data: msg });
  }
}

global.Worker = Worker as any; 