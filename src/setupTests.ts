import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { Subscriber } from 'svelte/store';
import * as ratificationWorker from '$mocks/workers/ratification.worker';

// Mock SvelteKit stores
vi.mock('$app/stores', async () => {
	const { readable, writable } = await import('svelte/store');
	const getStores = () => ({
		navigating: readable(null),
		page: readable({ 
			url: new URL('http://localhost'), 
			params: {},
			data: {
				example: 'http://example.com/test.gpx',
				rounds: [
					{ title: 'Test Round', slug: 'test-round' },
					{ title: 'Another Round', slug: 'another-round' }
				]
			}
		}),
		session: writable(null),
		updated: readable(false)
	});
	const page = {
		subscribe(fn: Subscriber<any>) {
			return getStores().page.subscribe(fn);
		}
	};
	const navigating = {
		subscribe(fn: Subscriber<any>) {
			return getStores().navigating.subscribe(fn);
		}
	};
	const session = {
		subscribe(fn: Subscriber<any>) {
			return getStores().session.subscribe(fn);
		}
	};
	const updated = {
		subscribe(fn: Subscriber<any>) {
			return getStores().updated.subscribe(fn);
		}
	};
	return {
		getStores,
		navigating,
		page,
		session,
		updated
	};
});

// Mock Browser Support
if (typeof window === 'undefined') {
  global.window = {
    URL: {
      createObjectURL: vi.fn(),
      revokeObjectURL: vi.fn()
    }
  } as any;
}

// Mock window object
vi.stubGlobal('window', {
  URL: {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn()
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  getComputedStyle: vi.fn(() => ({
    getPropertyValue: vi.fn(),
    setProperty: vi.fn()
  }))
});

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

// Mock @loaders.gl modules
vi.mock('@loaders.gl/kml', () => ({
  GPXLoader: vi.fn()
}));

vi.mock('@loaders.gl/core', () => ({
  load: vi.fn()
}));

vi.mock('@loaders.gl/worker-utils', () => ({
  __esModule: true,
  default: {
    createWorker: vi.fn()
  }
}));

// Mock maplibre-gl
vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn(() => ({
      on: vi.fn(),
      remove: vi.fn(),
      addControl: vi.fn(),
      addSource: vi.fn(),
      addLayer: vi.fn(),
      getSource: vi.fn(() => ({
        setData: vi.fn()
      })),
      fitBounds: vi.fn(),
      setCenter: vi.fn()
    }))
  }
}));

// Mock ratification worker
vi.mock('$lib/workers/ratification.worker', () => ratificationWorker); 