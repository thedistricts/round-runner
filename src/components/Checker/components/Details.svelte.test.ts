/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Details from './Details.svelte';
import { get } from "svelte/store";
import { gpx } from '$lib/stores/gpx.store';
import { breakdown } from '$lib/stores/breakdown.store';
import { ratification } from '$lib/stores/ratification.store';
import { debug } from '$lib/stores/ratification.store';
import { isRouteReversed } from '$lib/stores/route.store';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

// Mock the validation worker
const mockValidateTrack = vi.fn().mockResolvedValue({ isValid: true });
const mockValidateTimeIntervals = vi.fn().mockResolvedValue({ isValid: true, percentileInterval: 1 });

vi.mock('$lib/workers/validation.worker?worker', () => ({
  default: class {
    validateTrack = mockValidateTrack;
    validateTimeIntervals = mockValidateTimeIntervals;
  }
}));

// Mock comlink's wrap to return our mock methods
vi.mock('comlink', () => ({
  wrap: () => ({
    validateTrack: mockValidateTrack,
    validateTimeIntervals: mockValidateTimeIntervals
  })
}));

// Mock the stores
const mockGpxData = {
  features: [{
    properties: {
      time: '2024-03-20T10:00:00Z'
    }
  }]
};

vi.mock('$lib/stores/gpx.store', () => ({
  gpx: {
    subscribe: vi.fn((callback) => {
      callback(mockGpxData);
      return () => {};
    }),
    reset: vi.fn()
  }
}));

vi.mock('$lib/stores/breakdown.store', () => ({
  breakdown: {
    subscribe: vi.fn((callback) => {
      callback(false);
      return () => {};
    }),
    update: vi.fn(),
    reset: vi.fn()
  }
}));

vi.mock('$lib/stores/ratification.store', () => ({
  ratification: {
    reset: vi.fn()
  },
  debug: {
    reset: vi.fn()
  }
}));

vi.mock('$lib/stores/route.store', () => ({
  isRouteReversed: {
    subscribe: vi.fn((callback) => {
      callback(false);
      return () => {};
    })
  }
}));

vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

vi.mock('$app/stores', () => ({
  page: {
    subscribe: vi.fn((callback) => {
      callback({
        params: {
          round: 'test-round'
        }
      });
      return () => {};
    })
  }
}));

describe('Details component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(Details, { fileName: 'test.gpx' });
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render file details when processed', async () => {
    render(Details, { fileName: 'test.gpx' });
    
    // Wait for validation to complete
    await vi.waitFor(() => {
      expect(mockValidateTrack).toHaveBeenCalled();
      expect(mockValidateTimeIntervals).toHaveBeenCalled();
    });
    
    expect(screen.getByText('test.gpx')).toBeInTheDocument();
    expect(screen.getByText(/Start:/)).toBeInTheDocument();
    expect(screen.getByText(/Finish:/)).toBeInTheDocument();
    expect(screen.getByText(/Est Elapsed Time:/)).toBeInTheDocument();
  });

  it('should show breakdown button when valid', async () => {
    render(Details, { fileName: 'test.gpx' });
    
    // Wait for validation to complete
    await vi.waitFor(() => {
      expect(mockValidateTrack).toHaveBeenCalled();
      expect(mockValidateTimeIntervals).toHaveBeenCalled();
    });
    
    const breakdownButton = screen.getByText('Breakdown');
    expect(breakdownButton).toBeInTheDocument();
    
    await fireEvent.click(breakdownButton);
    expect(breakdown.update).toHaveBeenCalled();
  });

  it('should handle reset click', async () => {
    render(Details, { fileName: 'test.gpx' });
    
    // Wait for validation to complete
    await vi.waitFor(() => {
      expect(mockValidateTrack).toHaveBeenCalled();
      expect(mockValidateTimeIntervals).toHaveBeenCalled();
    });
    
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    await fireEvent.click(resetButton);
    
    expect(gpx.reset).toHaveBeenCalled();
    expect(ratification.reset).toHaveBeenCalled();
    expect(breakdown.reset).toHaveBeenCalled();
    expect(debug.reset).toHaveBeenCalled();
  });
}); 