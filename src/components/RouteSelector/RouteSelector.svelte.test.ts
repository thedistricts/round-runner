/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { gpx } from '$lib/stores/gpx.store';
import { breakdown } from '$lib/stores/breakdown.store';
import { ratification } from '$lib/stores/ratification.store';
import { isOpen } from '$lib/stores/checker.store';
import { URL_PARAM } from '$lib/enum';
import RouteSelector from './RouteSelector.svelte';

const mockPageData = {
  url: new URL('http://localhost'),
  route: { id: 'round-1' },
  params: {},
  data: {
    logo: '/logo.png',
    title: 'Test Title',
    slug: 'round-1',
    rounds: [
      { slug: 'round-1', title: 'Round 1' },
      { slug: 'round-2', title: 'Round 2' }
    ]
  },
  status: 200,
  error: null,
  form: undefined,
  state: { routeInformation: false }
};

vi.mock('$lib/stores/route.store', () => {
  const createStore = () => {
    const defaultValue = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Checkpoint 1', leg: 1, featureType: 'checkpoint' },
          geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        },
        {
          type: 'Feature',
          properties: { name: 'Checkpoint 2', leg: 1, featureType: 'checkpoint' },
          geometry: { type: 'Point', coordinates: [-122.4192, 37.7751] },
        },
      ],
    };

    return {
      value: defaultValue,
      subscribers: new Set<(value: any) => void>(),
      subscribe(callback: (value: any) => void) {
        callback(this.value);
        this.subscribers.add(callback);
        return {
          unsubscribe: () => this.subscribers.delete(callback)
        };
      },
      set(value: any) {
        this.value = value;
        this.subscribers.forEach(cb => cb(this.value));
      },
      update(fn: (value: any) => any) {
        this.value = fn(this.value);
        this.subscribers.forEach(cb => cb(this.value));
      }
    };
  };

  return {
    route: createStore(),
    routeFocus: createStore()
  };
});

vi.mock('$lib/stores/checker.store', () => {
  const store = {
    value: true, // Set isOpen to true by default
    subscribers: new Set<(value: boolean) => void>(),
    subscribe(callback: (value: boolean) => void) {
      callback(this.value);
      this.subscribers.add(callback);
      return {
        unsubscribe: () => this.subscribers.delete(callback)
      };
    },
    set(value: boolean) {
      this.value = value;
      this.subscribers.forEach(cb => cb(this.value));
    }
  };
  return { isOpen: store };
});

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

vi.mock('$app/stores', () => {
  const pageStore = {
    subscribe: vi.fn((callback) => {
      callback(mockPageData);
      return () => {};
    })
  };
  return { page: pageStore };
});

// Mock the stores with proper Svelte store contract implementation
vi.mock('$lib/stores/gpx.store', () => ({
  gpx: {
    value: null,
    subscribers: new Set<(value: any) => void>(),
    subscribe(callback: (value: any) => void) {
      callback(this.value);
      this.subscribers.add(callback);
      return {
        unsubscribe: () => this.subscribers.delete(callback)
      };
    },
    set(value: any) {
      this.value = value;
      this.subscribers.forEach(cb => cb(this.value));
    },
    reset: vi.fn()
  }
}));

vi.mock('$lib/stores/breakdown.store', () => ({
  breakdown: {
    value: false,
    subscribers: new Set<(value: boolean) => void>(),
    subscribe(callback: (value: boolean) => void) {
      callback(this.value);
      this.subscribers.add(callback);
      return {
        unsubscribe: () => this.subscribers.delete(callback)
      };
    },
    set(value: boolean) {
      this.value = value;
      this.subscribers.forEach(cb => cb(this.value));
    },
    reset: vi.fn()
  }
}));

vi.mock('$lib/stores/ratification.store', () => ({
  ratification: {
    value: null,
    subscribers: new Set<(value: any) => void>(),
    subscribe(callback: (value: any) => void) {
      callback(this.value);
      this.subscribers.add(callback);
      return {
        unsubscribe: () => this.subscribers.delete(callback)
      };
    },
    set(value: any) {
      this.value = value;
      this.subscribers.forEach(cb => cb(this.value));
    },
    reset: vi.fn()
  }
}));

vi.mock('$lib/stores/checker.store', () => ({
  isOpen: {
    value: false,
    subscribers: new Set<(value: boolean) => void>(),
    subscribe(callback: (value: boolean) => void) {
      callback(this.value);
      this.subscribers.add(callback);
      return {
        unsubscribe: () => this.subscribers.delete(callback)
      };
    },
    set(value: boolean) {
      this.value = value;
      this.subscribers.forEach(cb => cb(this.value));
    }
  }
}));

describe('RouteSelector component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the logo with correct attributes', () => {
    render(RouteSelector);
    const logo = screen.getByAltText('Test Title logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
    expect(logo).toHaveClass('h-[4rem]');
  });

  it('should render the route select with correct options', () => {
    render(RouteSelector);
    const select = screen.getByLabelText('Routes');
    const options = screen.getAllByRole('option');
    
    expect(select).toBeInTheDocument();
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Round 1');
    expect(options[1]).toHaveTextContent('Round 2');
    expect(options[0]).toHaveValue('round-1');
    expect(options[1]).toHaveValue('round-2');
    expect(select).toHaveValue('round-1');
  });

  it('should reset stores and navigate to the selected round on change', async () => {
    render(RouteSelector);
    const select = screen.getByLabelText('Routes');
    
    await fireEvent.change(select, { target: { value: 'round-2' } });

    expect(gpx.reset).toHaveBeenCalledTimes(1);
    expect(breakdown.reset).toHaveBeenCalledTimes(1);
    expect(ratification.reset).toHaveBeenCalledTimes(1);
    expect(goto).toHaveBeenCalledWith('/round-2');
    expect(get(isOpen)).toBe(false);
  });

  it('should navigate to route information when info param is present', async () => {
    // Update page mock to include info param
    vi.mocked(page.subscribe).mockImplementation((callback) => {
      callback({
        ...mockPageData,
        params: { info: 'route-information' },
        state: { routeInformation: true }
      });
      return () => {};
    });

    render(RouteSelector);
    const select = screen.getByLabelText('Routes');
    
    await fireEvent.change(select, { target: { value: 'round-2' } });

    expect(goto).toHaveBeenCalledWith(`/round-2/${URL_PARAM.ROUTE_INFORMATION}`);
    expect(get(isOpen)).toBe(true);
  });

  it('should handle logo link navigation', async () => {
    render(RouteSelector);
    const logoLink = screen.getByRole('link');
    
    expect(logoLink).toHaveAttribute('href', '/');
  });
});