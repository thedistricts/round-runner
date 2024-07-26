/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Details from './Details.svelte';
import { get } from "svelte/store";
import { gpx } from '$lib/stores/gpx.store';
import { breakdown } from '$lib/stores/breakdown.store';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

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


describe('Details component', () => {
  beforeEach(() => {
    vi.mock('$lib/stores/breakdown.store', () => ({
      breakdown: {
        reset: vi.fn(),
      },
    }));
    gpx.set(stubGpxData);
  });

  afterEach(() => {
    cleanup();
  });

  it('should render the file name and date', async () => {
    render(Details, { fileName: 'test.gpx' });
    const fileNameElement = screen.getByText('test.gpx');
    const dateElement = screen.getByText('01 January 2022');
    expect(fileNameElement).toBeInTheDocument();
    expect(dateElement).toBeInTheDocument();
  });

  it('should render the start and end times and elapsed time when the GPX file is valid', async () => {
    render(Details, { fileName: 'test.gpx' });
    const startTimeElement = screen.getByText(/12.00 am/);
    const endTimeElement = screen.getByText(/12.02 am/);
    const elapsedTimeElement = screen.getByText(/0 hours 2 minutes/);
    expect(startTimeElement).toBeInTheDocument();
    expect(endTimeElement).toBeInTheDocument();
    expect(elapsedTimeElement).toBeInTheDocument();
  });

  it('should toggle the breakdown when the breakdown button is clicked', async () => {
    render(Details, { fileName: 'test.gpx' });
    const breakdownButtonElement = screen.getByText('Ratification');
    await fireEvent.click(breakdownButtonElement);
    expect(get(breakdown)).toBe(true);
    await fireEvent.click(breakdownButtonElement);
    expect(get(breakdown)).toBe(false);
  });

  it('should render an error message when the GPX file is invalid', async () => {
    const noTimesStub: GPXGeoJson = JSON.parse(JSON.stringify(stubGpxData));
    noTimesStub.features[0].properties.coordinateProperties.times = [];
    gpx.set(noTimesStub);
    render(Details, { fileName: 'test.gpx' });
    const errorMessageElement = screen.getByText('Time information is missing from the file');
    expect(errorMessageElement).toBeInTheDocument();
  });

  it('should call the handleOnResetClick function when the reset button is clicked', async () => {
    const breakdownReset = vi.spyOn(breakdown, 'reset');
    render(Details, { fileName: 'test.gpx' });
    const resetButtonElement = screen.getByText('Reset');
    await fireEvent.click(resetButtonElement);
    expect(breakdownReset).toHaveBeenCalledTimes(1);
  });
});