/**
 * @vitest-environment jsdom
 */
import { get } from "svelte/store";
import { fireEvent, render, screen, cleanup } from '@testing-library/svelte';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Checkpoints from './Checkpoints.svelte';
import { route, routeFocus } from '$lib/stores/route.store';
import type { Feature, Point, FeatureCollection } from 'geojson';
import type { RouteGeoJson, PointProperties } from '$lib/stores/route.store.d';
import { POINT_FEATURE } from '$lib/enum';

// Mock the stores with proper Svelte store contract implementation
vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn((callback) => {
      callback({
        data: {
          slug: 'round-1',
          rounds: [
            { 
              slug: 'round-1', 
              title: 'Round 1',
              info: 'Test info',
              link: 'https://test.com'
            },
            { slug: 'round-2', title: 'Round 2' }
          ]
        }
      });
      return () => {};
    })
  }
}));

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

vi.mock('$lib/stores/viewport.store', () => ({
  viewport: {
    value: { isMobile: false },
    subscribers: new Set<(value: any) => void>(),
    subscribe(callback: (value: any) => void) {
      callback(this.value);
      this.subscribers.add(callback);
      return {
        unsubscribe: () => this.subscribers.delete(callback)
      };
    }
  }
}));

describe('Checkpoints component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the correct number of checkpoints', () => {
    render(Checkpoints);
    const checkpointElements = screen.getAllByRole('button');
    expect(checkpointElements.length).toBe(2);
  });

  it('should render checkpoints with correct names and leg numbers', () => {
    render(Checkpoints);
    const checkpoint1 = screen.getByText('1: Checkpoint 1');
    const checkpoint2 = screen.getByText('2: Checkpoint 2');
    
    expect(checkpoint1).toBeInTheDocument();
    expect(checkpoint2).toBeInTheDocument();
  });

  it('should call handleOnMapFocus with the correct coordinates when a checkpoint button is clicked', async () => {
    render(Checkpoints);
    const checkpoint1Button = screen.getByText('1: Checkpoint 1');
    const checkpoint2Button = screen.getByText('2: Checkpoint 2');
    
    await fireEvent.click(checkpoint1Button);
    expect(get(routeFocus)).toEqual([-122.4194, 37.7749]);

    await fireEvent.click(checkpoint2Button);
    expect(get(routeFocus)).toEqual([-122.4192, 37.7751]);
  });

  it('should handle empty route data gracefully', async () => {
    route.set({
      type: 'FeatureCollection',
      features: []
    } as FeatureCollection<Point, PointProperties>);
    
    render(Checkpoints);
    const checkpointElements = screen.queryAllByRole('button');
    expect(checkpointElements.length).toBe(0);
  });

  it('should handle non-checkpoint features in route data', async () => {
    const currentRoute = get(route);
    route.set({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Not a checkpoint', leg: 1, featureType: POINT_FEATURE.SUMMIT },
          geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        } as Feature<Point, PointProperties>,
        {
          type: 'Feature',
          properties: { name: 'Checkpoint 1', leg: 1, featureType: 'checkpoint' },
          geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        },
        {
          type: 'Feature',
          properties: { name: 'Checkpoint 2', leg: 1, featureType: 'checkpoint' },
          geometry: { type: 'Point', coordinates: [-122.4192, 37.7751] },
        }
      ]
    } as FeatureCollection<Point, PointProperties>);
    
    render(Checkpoints);
    const checkpointElements = screen.getAllByRole('button');
    expect(checkpointElements.length).toBe(2);
  });
});