/**
 * @vitest-environment jsdom
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import Breakdown from './Breakdown.svelte';
import { get } from "svelte/store";
import { gpx } from '$lib/stores/gpx.store';
import { ratification } from '$lib/stores/ratification.store';
import { breakdown } from '$lib/stores/breakdown.store';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { RatificationResults } from '$lib/stores/ratification.store.d';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { HOURS } from '$lib/const';

const stubGpxData: GPXGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        coordinateProperties: {
          times: ['2022-01-01T00:00:00Z', '2022-01-01T00:02:00Z', '2022-01-01T00:03:00Z'],
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

const ratificationResults: RatificationResults = [{
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-122.4194, 37.7749],
  },
  properties: {
    name: "Moot Hall (Start)",
    featureType: "start checkpoint",
    ratify: true,
    isStart: true,
    isEnd: false,
    leg: 1,
    index: 0,
    dist: 0,
    location: 0,
    valid: 'VALID',
    time: '2022-01-01T00:00:00Z',
    order: 0,
    notes: '',
  },
},
{
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-122.4194, 37.7749],
  },
  properties: {
    name: "Skiddaw",
    featureType: "summit",
    ratify: true,
    isStart: false,
    isEnd: true,
    leg: 1,
    index: 1,
    dist: 1,
    location: 1,
    valid: 'VALID',
    time: '2022-01-01T00:01:00Z',
    order: 1,
    notes: 'Example Notes',
  },
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749],
    },
    properties: {
      name: "Beck Wythop",
			featureType: "water entry",
      ratify: false,
      isStart: false,
      isEnd: true,
      leg: 1,
      index: 2,
      dist: 2,
      location: 2,
      valid: 'VALID',
      time: '2022-01-01T00:02:00Z',
      order: 2,
      notes: 'No Ratify - Should Not Render',
    },
  },
{
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [-122.4194, 37.7749],
  },
  properties: {
    name: "Moot Hall (Finish)",
    featureType: "finish checkpoint",
    ratify: true,
    isStart: false,
    isEnd: true,
    leg: 1,
    index: 3,
    dist: 3,
    location: 3,
    valid: 'VALID',
    time: '2022-01-01T00:03:00Z',
    order: 3,
    notes: '',
  },
}];

describe('Breakdown component', () => {
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

  it('should render the tile and close button', async () => {
    render(Breakdown);
    const tileElement = screen.getByText(/Ratification Breakdown/);
    const closeElement = screen.getByText(/Close/);

    expect(tileElement).toBeInTheDocument();
    expect(closeElement).toBeInTheDocument();
  });

  it('should render the date and start, end, elapsed time', async () => {
    render(Breakdown);
    const dateElement = screen.getByText(/01 January 2022/);
    const startTimeElement = screen.getByText(/12.00 am/);
    const endTimeElement = screen.getByText(/12.03 am/);
    const elapsedTimeElement = screen.getByText(/0 hours 3 minutes/);

    expect(dateElement).toBeInTheDocument();
    expect(startTimeElement).toBeInTheDocument();
    expect(endTimeElement).toBeInTheDocument();
    expect(elapsedTimeElement).toBeInTheDocument();
  });

  it('should render breakdown table', async () => {
    ratification.set(ratificationResults);
    render(Breakdown);
    const tableElement = screen.getByRole("table");
    const StartElement = screen.getByText("Start");
    const EndElement = screen.getByText("Finish");
    expect(tableElement).toBeInTheDocument();
    expect(StartElement).toBeInTheDocument();
    expect(EndElement).toBeInTheDocument();
  });

  describe.each(ratificationResults.filter(json => json.properties.ratify))('should render breakdown table result when ratify is true', (json) => {
    it(`should find ${json.properties.name} table row result` , () => {
      ratification.set(ratificationResults);
      render(Breakdown);
      const nameElement = screen.getByText(json.properties.name);
      const timeElement = screen.getByText(dayjs(json.properties.time).utc().format(HOURS));
      expect(nameElement).toBeInTheDocument();
      expect(timeElement).toBeInTheDocument();
    });
  });

  describe.each(ratificationResults.filter(json => !json.properties.ratify))('should not render breakdown table result when ratify is false', (json) => {
    it(`should not find ${json.properties.name} table row result` , () => {
      ratification.set(ratificationResults);
      render(Breakdown);
      const nameElements = screen.queryAllByText(json.properties.name);
      expect(nameElements).length(0);
    });
  });

  describe.each(ratificationResults.filter(json => json.properties.notes !== "" && json.properties.ratify))('should render breakdown table result notes', (json) => {
    it(`should find ${json.properties.name} table row notes` , () => {
      ratification.set(ratificationResults);
      render(Breakdown);
      const notesElements = screen.getByText(json.properties.notes ?? "");
      expect(notesElements).toBeInTheDocument();
    });
  });

  it('should toggle the breakdown when the close button is clicked', async () => {
    render(Breakdown);
    const closeButtonElement = screen.getByText('Close');
    breakdown.set(true);
    await fireEvent.click(closeButtonElement);
    expect(get(breakdown)).toBe(false);
  });
});