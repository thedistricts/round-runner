import '@testing-library/jest-dom';
import { vi } from 'vitest';
import type { Subscriber } from 'svelte/store';
import * as ratificationWorker from './mocks/workers/ratification.worker';
import * as validationWorker from './mocks/workers/validation.worker';

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
  addEventListener() {}
  removeEventListener() {}
}

globalThis.Worker = Worker as any;

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

const windowMock = {
  URL: {
    createObjectURL: vi.fn(() => 'blob:mock-url'),
    revokeObjectURL: vi.fn()
  },
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  getComputedStyle: vi.fn(() => ({
    getPropertyValue: vi.fn(),
    setProperty: vi.fn()
  }))
};

vi.stubGlobal('window', windowMock);

// Mock ratification worker
vi.mock('$lib/workers/ratification.worker', () => ratificationWorker);

// Mock validation worker
vi.mock('$lib/workers/validation.worker', () => validationWorker); 