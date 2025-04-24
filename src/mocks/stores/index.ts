import { vi } from 'vitest';
import { writable } from 'svelte/store';
import { featureCollection } from '@turf/turf';
import type { Feature, LineString } from 'geojson';
import type { RouteGeoJson } from '$lib/stores/route.store.d';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

interface RatificationResult {
  checkpointName: string;
  status: string;
}

// Mock gpx store
export const mockGpxStore = {
  gpx: {
    ...writable<GPXGeoJson>({
      type: 'FeatureCollection',
      features: []
    }),
    reset: vi.fn()
  }
};

// Mock route store
export const mockRouteStore = {
  route: {
    ...writable<RouteGeoJson>(featureCollection([])),
    set: vi.fn()
  },
  isRouteReversed: {
    ...writable<boolean>(false),
    set: vi.fn(),
    subscribe: vi.fn((fn) => {
      fn(false);
      return () => {};
    })
  }
};

// Mock ratification store
export const mockRatificationStore = {
  ratification: {
    ...writable<RatificationResult[]>([]),
    reset: vi.fn()
  },
  debug: writable<RatificationResult[]>([]),
  results: writable<RatificationResult[]>([])
};

// Mock breakdown store
export const mockBreakdownStore = {
  breakdown: {
    ...writable(false),
    reset: vi.fn()
  }
};

// Mock checker store
export const mockCheckerStore = {
  isOpen: writable(false)
}; 