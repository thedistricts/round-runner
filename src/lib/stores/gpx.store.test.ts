import { describe, it, expect, beforeEach } from 'vitest';
import { gpx, gpxBBox } from './gpx.store';
import { featureCollection } from '@turf/helpers';
import type { GPXGeoJson } from './gpx.store.d';

describe('GPX Store', () => {
  beforeEach(() => {
    gpx.reset();
  });

  it('should initialize with an empty feature collection', () => {
    let storeValue: GPXGeoJson;
    gpx.subscribe(value => {
      storeValue = value;
    });
    expect(storeValue!.features).toHaveLength(0);
  });

  it('should set new GPX data', () => {
    const testData: GPXGeoJson = featureCollection([
      {
        type: 'Feature',
        properties: {
          coordinateProperties: { times: ['2023-01-01T00:00:00Z'] },
          gpxx_TrackExtension: '',
          name: 'Test Track',
          time: '2023-01-01T00:00:00Z',
          _gpxType: 'track'
        },
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0], [1, 1]]
        }
      }
    ]);

    gpx.set(testData);

    let storeValue: GPXGeoJson;
    gpx.subscribe(value => {
      storeValue = value;
    });
    expect(storeValue!.features).toHaveLength(1);
    expect(storeValue!.features[0].properties.name).toBe('Test Track');
  });

  it('should update existing GPX data', () => {
    const initialData: GPXGeoJson = featureCollection([
      {
        type: 'Feature',
        properties: {
          coordinateProperties: { times: ['2023-01-01T00:00:00Z'] },
          gpxx_TrackExtension: '',
          name: 'Initial Track',
          time: '2023-01-01T00:00:00Z',
          _gpxType: 'track'
        },
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0], [1, 1]]
        }
      }
    ]);

    gpx.set(initialData);
    gpx.update(current => {
      const updated = { ...current };
      updated.features[0].properties.name = 'Updated Track';
      return updated;
    });

    let storeValue: GPXGeoJson;
    gpx.subscribe(value => {
      storeValue = value;
    });
    expect(storeValue!.features[0].properties.name).toBe('Updated Track');
  });

  it('should reset to empty collection', () => {
    const testData: GPXGeoJson = featureCollection([
      {
        type: 'Feature',
        properties: {
          coordinateProperties: { times: ['2023-01-01T00:00:00Z'] },
          gpxx_TrackExtension: '',
          name: 'Test Track',
          time: '2023-01-01T00:00:00Z',
          _gpxType: 'track'
        },
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0], [1, 1]]
        }
      }
    ]);

    gpx.set(testData);
    gpx.reset();

    let storeValue: GPXGeoJson;
    gpx.subscribe(value => {
      storeValue = value;
    });
    expect(storeValue!.features).toHaveLength(0);
  });

  it('should calculate bounding box', () => {
    const testData: GPXGeoJson = featureCollection([
      {
        type: 'Feature',
        properties: {
          coordinateProperties: { times: ['2023-01-01T00:00:00Z'] },
          gpxx_TrackExtension: '',
          name: 'Test Track',
          time: '2023-01-01T00:00:00Z',
          _gpxType: 'track'
        },
        geometry: {
          type: 'LineString',
          coordinates: [[0, 0], [1, 1]]
        }
      }
    ]);

    gpx.set(testData);

    let bboxValue: number[];
    gpxBBox.subscribe(value => {
      bboxValue = value;
    });
    expect(bboxValue!).toEqual([0, 0, 1, 1]);
  });
}); 