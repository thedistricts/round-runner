/**
 * @vitest-environment jsdom
 */

import { fireEvent, render, screen, cleanup } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Checker from './Checker.svelte';
import { route } from '$lib/stores/route.store';
import { gpx } from '$lib/stores/gpx.store';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

vi.mock('$lib/stores/ratification.store', () => ({
  ratification: {
    reset: vi.fn(),
  },
}));

const stubGpxData: GPXGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        coordinateProperties: {
          times: ['2022-01-01T00:00:00Z', '2022-01-01T00:01:00Z', '2022-01-01T00:02:00Z'],
        },
        gpxx_TrackExtension: 'TrackExtension',
        name: 'Track 1',
        time: '2022-01-01T00:00:00Z',
        _gpxType: 'Track',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.4194, 37.7749],
          [-122.4192, 37.7751],
          [-122.419, 37.7753],
        ],
      },
    },
  ],
};

describe('Checker component', () => {

  beforeEach(() => {
    route.set({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Checkpoint 1', leg: 1, featureType: 'checkpoint' },
          geometry: { type: 'Point', coordinates: [-122.4194, 37.7749] },
        },
        {
          type: 'Feature',
          properties: { name: 'Checkpoint 2', leg: 1, featureType: 'checkpoint'  },
          geometry: { type: 'Point', coordinates: [-122.4192, 37.7751] },
        },
      ],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the route selector', () => {
    render(Checker);
    const routeSelectorElement = screen.getByText('View Checkpoints');
    expect(routeSelectorElement).toBeInTheDocument();
  });

  it('should not render the checkpoint list when closed', () => {
    render(Checker);
    const childrenCheckpointCountElement = screen.getByText(/2Checkpoints/);
    expect(childrenCheckpointCountElement).toBeInTheDocument();
    const childrenCheckpointElements = screen.queryAllByText(/:Checkpoint/);
    expect(childrenCheckpointElements).toHaveLength(0);
  });

  it('should render the checkpoint list when open', async () => {
    render(Checker);
    const expander = screen.getByText('View Checkpoints');
    await fireEvent.click(expander);
    const childrenCheckpointCountElement = screen.getByText(/2Checkpoints/);
    const childrenCheckpointElements = screen.queryAllByText(/:Checkpoint/);
    const childrenCheckpointElement = screen.getByText(/1:Checkpoint 1/);
    expect(childrenCheckpointCountElement).toBeInTheDocument();
    expect(childrenCheckpointElement).toBeInTheDocument();
    expect(childrenCheckpointElements).toHaveLength(2);
  });

  it('should render ratification list when gpx is populated', () => {
    gpx.set(stubGpxData);
    render(Checker);
    const expander = screen.getByText('Ratification');
    expect(expander).toBeInTheDocument();
  });

  it('should clear ratification list when reset button is clicked', async () => {
    gpx.set(stubGpxData);
    render(Checker);
    const expander = screen.getByText('Reset');
    await fireEvent.click(expander);
    const childrenCheckpointCountElement = screen.getByText(/2Checkpoints/);
    expect(childrenCheckpointCountElement).toBeInTheDocument();
  });
});