/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { writable } from 'svelte/store';
import { featureCollection } from '@turf/turf';
import type { Feature, LineString } from 'geojson';
import type { RouteGeoJson } from '$lib/stores/route.store.d';
import { route, isRouteReversed } from '$lib/stores/route.store';

vi.stubGlobal('window', {
  URL: {
    createObjectURL: vi.fn(),
    revokeObjectURL: vi.fn()
  }
});

vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn((fn) => {
      fn({
        data: {
          example: 'https://example.com/test.gpx'
        },
        state: {
          routeInformation: true
        },
        route: {
          id: null
        }
      });
      return () => {};
    })
  }
}));

vi.mock('$app/environment', () => ({
  browser: true
}));

vi.mock('$lib/stores/gpx.store', () => {
  const mockGpxStore = writable<Feature<LineString>>(featureCollection([]));
  return {
    gpx: mockGpxStore
  };
});

vi.mock('$lib/stores/route.store', () => {
  const mockRouteStore = writable<RouteGeoJson>(featureCollection([]));
  const mockIsReversedStore = writable<boolean>(false);
  return {
    route: {
      ...mockRouteStore,
      set: vi.fn()
    },
    isRouteReversed: {
      ...mockIsReversedStore,
      set: vi.fn(),
      subscribe: vi.fn((fn) => {
        fn(false);
        return () => {};
      })
    }
  };
});

vi.mock('$lib/stores/ratification.store', () => ({
  ratification: writable([]),
  debug: writable([])
}));

// Mock FilePond as a simple div with the required props
vi.mock('svelte-filepond', () => ({
  default: vi.fn().mockImplementation((props) => {
    const div = document.createElement('div');
    div.className = 'filepond';
    div.innerHTML = `
      <div class="filepond--root">
        <input type="file" class="filepond--browser" />
        <div class="filepond--drop-label">
          <label for="filepond">${props.labelIdle}</label>
        </div>
      </div>
    `;
    
    // Call oninit if provided
    if (props.oninit) {
      props.oninit();
    }
    
    return {
      $$: {
        fragment: {
          c: () => {},
          m: () => {},
          d: () => {},
          l: () => {},
          p: () => {},
          r: () => {},
          u: () => {},
          i: () => {},
          o: () => {}
        },
        ctx: [],
        props: props,
        update: () => {},
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        dirty: [0],
        skip_bound: false,
        root: document.createElement('div')
      }
    };
  }),
  registerPlugin: vi.fn()
}));

vi.mock('filepond-plugin-file-validate-type', () => ({
  default: vi.fn()
}));

vi.mock('./Details.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $destroy: vi.fn()
  }))
}));

vi.mock('@loaders.gl/core', () => ({
  load: vi.fn()
}));

vi.mock('@loaders.gl/kml', () => ({
  GPXLoader: {}
}));

vi.mock('comlink', () => {
  const mockRatify = vi.fn();
  const mockDebug = vi.fn();
  return {
    wrap: vi.fn().mockReturnValue({
      ratify: mockRatify,
      debug: mockDebug
    })
  };
});

vi.mock('$lib/workers/ratification.worker', () => {
  const mockWorker = {
    terminate: vi.fn(),
    addEventListener: vi.fn(),
    postMessage: vi.fn(),
    onmessage: null
  };
  return {
    default: vi.fn().mockImplementation(() => mockWorker)
  };
});

// Import the component after all mocks are set up
import Upload from './Upload.svelte';

describe('Upload component', () => {
  let mockRouteStore: ReturnType<typeof writable<RouteGeoJson>>;
  let mockIsReversedStore: ReturnType<typeof writable<boolean>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouteStore = writable<RouteGeoJson>(featureCollection([]));
    mockIsReversedStore = writable<boolean>(false);
  });

  it('should render the file upload interface', () => {
    render(Upload);
    const filePondWrapper = screen.getByTestId('filepond-wrapper');
    expect(filePondWrapper).toBeInTheDocument();
  });

  it('should show the example button when example URL is provided', () => {
    render(Upload);
    expect(screen.getByText('See example')).toBeInTheDocument();
  });

  it('should show the CCW toggle when example URL is provided', () => {
    render(Upload);
    expect(screen.getByText('CCW')).toBeInTheDocument();
  });

  it('should handle route reversal', async () => {
    // Set up initial route data
    const initialRoute: RouteGeoJson = {
      type: 'FeatureCollection',
      features: [
        { 
          type: 'Feature', 
          properties: {
            leg: 1,
            featureType: 'start',
            name: 'Test Point'
          },
          geometry: { 
            type: 'Point', 
            coordinates: [0, 0] 
          } 
        },
        { 
          type: 'Feature', 
          properties: {
            leg: 2,
            featureType: 'end',
            name: 'Test Point 2'
          },
          geometry: { 
            type: 'Point', 
            coordinates: [1, 1] 
          } 
        }
      ]
    };
    
    render(Upload);
    
    // Click the CCW toggle
    const ccwToggle = screen.getByRole('checkbox');
    await fireEvent.click(ccwToggle);
    
    // Verify that the stores were updated
    expect(isRouteReversed.set).toHaveBeenCalledWith(true);
    expect(route.set).toHaveBeenCalledWith({
      ...initialRoute,
      features: []
    });
  });
}); 