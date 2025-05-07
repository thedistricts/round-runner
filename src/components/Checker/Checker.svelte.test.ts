/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import { featureCollection } from '@turf/turf';
import type { Feature, LineString, FeatureCollection } from 'geojson';
import { gpx } from '$lib/stores/gpx.store';
import { breakdown } from '$lib/stores/breakdown.store';
import { isOpen } from '$lib/stores/checker.store';
import * as navigation from '$app/navigation';
import { page } from '$app/stores';
import type { Page } from '@sveltejs/kit';
import Checker from './Checker.svelte';

// Mock components
vi.mock('../RouteSelector/RouteSelector.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $$: {
      fragment: {
        c: () => {},
        m: (target: HTMLElement) => {
          const div = document.createElement('div');
          div.setAttribute('data-testid', 'route-selector');
          div.textContent = 'Route Selector';
          target.appendChild(div);
        },
        d: () => {},
        l: () => {}
      },
      ctx: [],
      after_update: [],
      on_mount: [],
      on_destroy: []
    },
    $set: () => {},
    $destroy: () => {}
  }))
}));

vi.mock('./components/Upload.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $$: {
      fragment: {
        c: () => {},
        m: (target: HTMLElement) => {
          const div = document.createElement('div');
          div.setAttribute('data-testid', 'upload-component');
          div.textContent = 'Upload';
          target.appendChild(div);
        },
        d: () => {},
        l: () => {}
      },
      ctx: [],
      after_update: [],
      on_mount: [],
      on_destroy: []
    },
    $set: () => {},
    $destroy: () => {}
  }))
}));

vi.mock('./components/Checkpoints.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $$: {
      fragment: {
        c: () => {},
        m: (target: HTMLElement) => {
          const div = document.createElement('div');
          div.setAttribute('data-testid', 'checkpoints-component');
          div.textContent = 'Checkpoints';
          target.appendChild(div);
        },
        d: () => {},
        l: () => {}
      },
      ctx: [],
      after_update: [],
      on_mount: [],
      on_destroy: []
    },
    $set: () => {},
    $destroy: () => {}
  }))
}));

vi.mock('./components/Results.svelte', () => ({
  default: vi.fn().mockImplementation(() => ({
    $$: {
      fragment: {
        c: () => {},
        m: (target: HTMLElement) => {
          const div = document.createElement('div');
          div.setAttribute('data-testid', 'results-component');
          div.textContent = 'Results';
          target.appendChild(div);
        },
        d: () => {},
        l: () => {}
      },
      ctx: [],
      after_update: [],
      on_mount: [],
      on_destroy: []
    },
    $set: () => {},
    $destroy: () => {}
  }))
}));


describe('Checker component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    
    // Reset store values
    gpx.set(featureCollection([]));
    isOpen.set(false);
    breakdown.set(false);
    
    // Mock page store with complete Page object
    vi.spyOn(page, 'subscribe').mockImplementation((run) => {
      const mockPage: Page = {
        url: new URL('http://localhost/test-round'),
        params: {
          round: 'test-round',
          showInfo: 'false'
        },
        route: { id: null },
        status: 200,
        error: null,
        data: {},
        form: null,
        state: {
          routeInformation: true
        }
      };
      run(mockPage);
      return () => {};
    });

    // Mock window object with proper event handling
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/test-round',
        href: 'http://localhost/test-round'
      },
      writable: true
    });

    // Add dispatchEvent to window mock
    window.dispatchEvent = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the route selector', () => {
    render(Checker);
    expect(screen.getByTestId('route-selector')).toBeTruthy();
  });

  it('should render the Upload component when no GPX is loaded', () => {
    render(Checker);
    expect(screen.getByTestId('upload-component')).toBeTruthy();
  });

  it('should render the Checkpoints component when no GPX is loaded and isOpen is true', () => {
    isOpen.set(true);
    render(Checker);
    expect(screen.getByTestId('checkpoints-component')).toBeTruthy();
  });

  it('should render the Results component when GPX is loaded', () => {
    gpx.set(featureCollection([{
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [[0, 0]]
      }
    }]));
    isOpen.set(true);
    render(Checker);
    expect(screen.getByTestId('results-component')).toBeTruthy();
  });

  it('should handle popstate events correctly', () => {
    render(Checker);
    
    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        pathname: '/test-round/route-information'
      },
      writable: true
    });
    
    // Create and dispatch popstate event
    const popStateEvent = new PopStateEvent('popstate');
    window.dispatchEvent(popStateEvent);
    
    // Check if gpx was reset and isOpen was updated
    let gpxValue: FeatureCollection = featureCollection([]);
    gpx.subscribe(value => gpxValue = value)();
    expect(gpxValue.features).toHaveLength(0);
    
    expect(screen.getByTestId('route-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('results-component')).not.toBeInTheDocument();
  });

  it('should handle navigation when toggling expander', async () => {
    vi.spyOn(navigation, "goto");
    render(Checker);
    const expand = screen.getByText("View Checkpoints")
    expand.click();
    expect(navigation.goto).toHaveBeenCalledWith('/test-round/route-information');
    expand.click();
    expect(navigation.goto).toHaveBeenCalledWith('/test-round');
  });
}); 